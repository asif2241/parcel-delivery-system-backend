import express from "express"
import { OTPControllers } from "./otp.controller"

export const OtpRoutes = express.Router()

OtpRoutes.post("/send-otp", OTPControllers.sendOTP)
OtpRoutes.post("/verify-otp", OTPControllers.verifyOTP)