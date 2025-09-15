import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs"
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExists = await User.findOne({ email })

    if (isUserExists) {
        throw new AppError(400, "User already exists!!")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user
}

//get all user
const getAllUsers = async () => {
    const users = await User.find({}).select("-password");
    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }

}
//get single user
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(403, "You can only update your own profile")
        }
    }

    const isUserExists = await User.findById(userId);

    if (!isUserExists) {
        throw new AppError(404, "User not found")
    }

    if (decodedToken.role === Role.ADMIN && isUserExists.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "An Admin Cannot Update  Super Admin")
    }

    if (payload.role) {
        if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
            throw new AppError(401, "You cannot update your role")
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(401, "Only Super Admin Can Create an Admin")
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(401, "You are not authorized to update this field!")
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true, runValidators: true
    })

    return newUpdatedUser
}


const blockUser = async (id: string, decodedToken: JwtPayload) => {
    const user = await User.findById(id).select("-password");

    if (!user) {
        throw new AppError(404, "User not found!")
    }

    if (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) {
        throw new AppError(403, "Cannot Block  Admin Users")
    }

    if (user.isBlocked) {
        throw new AppError(404, "User is Already Blocked!")
    }

    user.isBlocked = true;
    user.blockedBy = decodedToken.userId;

    await user.save();

    return user

}


const unBlockUser = async (id: string) => {
    const user = await User.findById(id).select("-password");

    if (!user) {
        throw new AppError(404, "User not found!")
    }

    if (!user.isBlocked) {
        throw new AppError(404, "User is Already Unblocked")
    }

    user.isBlocked = false;
    user.blockedBy = undefined;

    await user.save();

    return user

}

export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    blockUser,
    unBlockUser
}