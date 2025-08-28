import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs"
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";

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


export const UserServices = {
    createUser
}