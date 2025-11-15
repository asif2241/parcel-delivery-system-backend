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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env");
const user_constant_1 = require("./user.constant");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(400, "User already exists!!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = { provider: "credentials", providerId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
});
//get all user
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const userRole = query.role;
    const searchEmail = query.searchEmail;
    const userInputSort = query.sort || "-createdAt";
    const sortField = userInputSort.startsWith('-') ? userInputSort.substring(1) : userInputSort;
    let sort = "-createdAt";
    if (user_constant_1.userSortField.includes(sortField)) {
        sort = userInputSort;
    }
    const filter = {};
    if (userRole) {
        filter.role = userRole;
    }
    if (searchEmail) {
        filter.email = searchEmail;
    }
    const users = yield user_model_1.User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password");
    const totalUsers = yield user_model_1.User.countDocuments(filter);
    const totalPage = Math.ceil(totalUsers / limit);
    const meta = {
        page,
        limit,
        totalPage,
        total: totalUsers
    };
    return {
        data: users,
        meta: meta
    };
});
//get single user
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.SENDER || decodedToken.role === user_interface_1.Role.RECEIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(403, "You can only update your own profile");
        }
    }
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(404, "User not found");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN && isUserExists.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(401, "An Admin Cannot Update  Super Admin");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.RECEIVER || decodedToken.role === user_interface_1.Role.SENDER) {
            throw new AppError_1.default(401, "You cannot update your role");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(401, "Only Super Admin Can Create an Admin");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.SENDER || decodedToken.role === user_interface_1.Role.RECEIVER) {
            throw new AppError_1.default(401, "You are not authorized to update this field!");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true, runValidators: true
    });
    return newUpdatedUser;
});
const getMe = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId).select("-password");
    return {
        data: user
    };
});
const blockUser = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found!");
    }
    if (user.role === user_interface_1.Role.SUPER_ADMIN || user.role === user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(403, "Cannot Block  Admin Users");
    }
    if (user.isBlocked) {
        throw new AppError_1.default(404, "User is Already Blocked!");
    }
    user.isBlocked = true;
    user.blockedBy = decodedToken.userId;
    yield user.save();
    return user;
});
const unBlockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found!");
    }
    if (!user.isBlocked) {
        throw new AppError_1.default(404, "User is Already Unblocked");
    }
    user.isBlocked = false;
    user.blockedBy = undefined;
    yield user.save();
    return user;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    blockUser,
    unBlockUser,
    getMe
};
