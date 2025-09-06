/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExists = await User.findOne({ email })

    if (!isUserExists) {
        throw new AppError(400, "Email does not exists")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExists.password as string)
    if (!isPasswordMatched) {
        throw new AppError(400, "Incorrect password")
    }

    const userTokens = createUserTokens(isUserExists)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExists.toObject()

    return {
        userTokens,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    }
}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user?.password as string)
    if (!isOldPasswordMatched) {
        throw new AppError(400, "Old Password does not matched!")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user?.save()
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    changePassword
}