/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OTPServices } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";

const sendOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;

    await OTPServices.sendOTP(email, name)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent Successfully",
        data: null
    })
})

const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    await OTPServices.verifyOTP(email, otp)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified Successfully",
        data: null
    })
})

export const OTPControllers = {
    sendOTP,
    verifyOTP
}