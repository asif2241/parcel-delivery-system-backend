/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelServices } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const payload = { ...req.body, image: req.file?.path };
    const decodedToken = req.user;

    const result = await ParcelServices.createParcel(payload, decodedToken as JwtPayload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Parcel created successfully",
        data: result
    })
})

const getAllParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user;
    const query = req.query;

    const result = await ParcelServices.getAllParcel(decodedToken as JwtPayload, query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Parcels retrived successfully",
        data: result.data,
        meta: result.meta
    })
})

const getSingleParcelById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await ParcelServices.getSingleParcelById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "parcel retrieve successfully",
        data: result
    })
})

const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const id = req.params.id;

    const result = await ParcelServices.cancelParcel(decodedToken as JwtPayload, id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: result
    })
})

const trackParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const trackingId = req.params.trackingId;
    const result = await ParcelServices.trackParcel(trackingId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tracking parcel",
        data: result
    })
})

const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.parcelId;
    const payload = req.body;
    const decodedToken = req.user;

    const result = await ParcelServices.updateParcelStatus(decodedToken as JwtPayload, parcelId, payload)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcel status updated successfully",
        data: result
    })
})

export const ParcelControllers = {
    createParcel,
    getAllParcel,
    getSingleParcelById,
    cancelParcel,
    trackParcel,
    updateParcelStatus
}


