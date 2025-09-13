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
    const users = await User.find({});
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
            throw new AppError(401, "You are not authorized!")
        }
    }

    const isUserExists = await User.findById(userId);
    if (!isUserExists) {
        throw new AppError(404, "User not found")
    }

    if (decodedToken.role === Role.ADMIN && isUserExists.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }

    if (payload.role) {
        if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
            throw new AppError(401, "you are not authorized!")
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(401, "You are not authorized!")
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(401, "You are not authorized!")
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true, runValidators: true
    })

    return newUpdatedUser
}



export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser
}