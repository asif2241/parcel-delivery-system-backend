"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const userTokens_1 = require("../../utils/userTokens");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../utils/sendEmail");
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (!isUserExists) {
        throw new AppError_1.default(400, "Email does not exists");
    }
    //ইউজার গুগল দিয়ে একাউন্ত করেছে কিনা চেক করা 
    const isGoogleAuthenticated = isUserExists.auths.some(providerObjects => providerObjects.provider == "google");
    if (isGoogleAuthenticated && !isUserExists.password) {
        throw new AppError_1.default(400, "You have authenticated through google. So if you want to login with credentials, then first login with google and set password for your gmail and the you can login with email and password");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExists.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(400, "Incorrect password");
    }
    const userTokens = (0, userTokens_1.createUserTokens)(isUserExists);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isUserExists.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        userTokens,
        user: rest
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatched = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isOldPasswordMatched) {
        throw new AppError_1.default(400, "Old Password does not matched!");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user === null || user === void 0 ? void 0 : user.save();
});
const setPassword = (plainPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(400, "User not found");
    }
    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError_1.default(403, "You have already set your password. Now you can change your password from your profile password update");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email
    };
    const auths = [...user.auths, credentialProvider];
    user.password = hashedPassword;
    user.auths = auths;
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (!isUserExists) {
        throw new AppError_1.default(404, "User does not exist");
    }
    // if (!isUserExists.isVerified) {
    //     throw new AppError(404, "User is not verified")
    // }
    if (isUserExists.isActive === user_interface_1.isActive.INACTIVE) {
        throw new AppError_1.default(401, `User is ${isUserExists.isActive}`);
    }
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(401, "User is deleted");
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.default(401, "User is Blocked");
    }
    const JwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    };
    const resetToken = jsonwebtoken_1.default.sign(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExists._id}&toke=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExists.email,
        subject: "Password Reset",
        templateName: "forgotPassword",
        templateData: {
            name: isUserExists.name,
            resetUILink
        }
    });
    // **
    //  * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
    //  *
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload._id !== decodedToken.userId) {
        throw new AppError_1.default(401, "You cannot reset password");
    }
    const isUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExists) {
        throw new AppError_1.default(401, "User does not exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExists.password = hashedPassword;
    yield isUserExists.save();
});
exports.AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
};
