"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
const express_1 = __importDefault(require("express"));
const otp_controller_1 = require("./otp.controller");
exports.OtpRoutes = express_1.default.Router();
exports.OtpRoutes.post("/send-otp", otp_controller_1.OTPControllers.sendOTP);
exports.OtpRoutes.post("/verify-otp", otp_controller_1.OTPControllers.verifyOTP);
