"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
exports.UserRoutes = (0, express_1.Router)();
exports.UserRoutes.post("/register", 
//  validateRequest(createUserZodSchema),
user_controller_1.UserController.createUser);
exports.UserRoutes.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.ADMIN), user_controller_1.UserController.getAllUsers);
exports.UserRoutes.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.getMe);
exports.UserRoutes.get("/:id", user_controller_1.UserController.getSingleUser);
exports.UserRoutes.patch("/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.updateUser);
exports.UserRoutes.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserController.blockUser);
exports.UserRoutes.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserController.unBlockUser);
