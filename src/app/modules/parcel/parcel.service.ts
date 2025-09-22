/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { IParcel, IStatusLog, PARCEL_STATUS } from "./parcel.interface";
import { generateTrackingId } from "../../utils/generateTrackingId";
import { calculateParcelFee } from "../../utils/calculateFee";
import { Parcel } from "./parcel.model";
import { Role } from "../user/user.interface";
import { allowedSortFields, nonCancellableStatuses } from "./parcel.constant";
import AppError from "../../errorHelpers/AppError";


const createParcel = async (payload: IParcel, decodedToken: JwtPayload) => {

    // throw new AppError(222, "fake error")

    const newParcelData = {
        ...payload,
        trackingId: generateTrackingId(),
        fee: calculateParcelFee(payload.weight),
        sender: decodedToken.userId,
        currentStatus: PARCEL_STATUS.REQUESTED,
        statusHistory: [{
            status: PARCEL_STATUS.REQUESTED,
            updatedBy: decodedToken.userId,
            notes: "Parcel created"
        }]
    }

    const parcel = await Parcel.create(newParcelData);
    return parcel
}

const getAllParcel = async (decodedToken: JwtPayload, query: Record<string, string>) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const currentStatus = query.currentStatus;
    const parcelType = query.parcelType;

    //safer sorting logic
    const userInputSort = query.sort || "-createdAt";
    const sortField = userInputSort.startsWith('-') ? userInputSort.substring(1) : userInputSort;
    let sort = "-createdAt";
    if (allowedSortFields.includes(sortField)) {
        sort = userInputSort;
    }


    const filter: Record<string, any> = {};

    if (decodedToken.role === Role.SENDER) {
        filter.sender = decodedToken.userId;
    } else if (decodedToken.role === Role.RECEIVER) {
        filter["receiver.email"] = decodedToken.email;
    } else if (decodedToken.role === Role.SUPER_ADMIN || decodedToken.role === Role.ADMIN) {
        // admin and super admin can view all the parcels,
    }

    if (currentStatus) {
        filter.currentStatus = currentStatus
    }
    if (parcelType) {
        filter.parcelType = parcelType
    }

    const allParcels = await Parcel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    // if (allParcels.length === 0) {
    //     throw new AppError(404, "No Parcel found!!!")
    // }

    const totalParcel = await Parcel.countDocuments(filter);
    const totalPage = Math.ceil(totalParcel / limit)

    const meta = {
        page,
        limit,
        totalPage,
        total: totalParcel
    }

    return {
        data: allParcels,
        meta: meta
    }
}

const getSingleParcelById = async (id: string) => {
    const parcel = await Parcel.findById(id);
    return parcel
}

const cancelParcel = async (decodedToken: JwtPayload, id: string) => {

    const parcel = await Parcel.findById(id);

    if (decodedToken.userId !== parcel?.sender.toString()) {
        throw new AppError(401, "Sorry, you are not authorized to cancel this percel")
    }
    if (nonCancellableStatuses.includes(parcel!.currentStatus)) {
        throw new AppError(400, `Sorry! You cannot cancel parcel. Current status: ${parcel?.currentStatus}`)
    }

    parcel!.currentStatus = PARCEL_STATUS.CANCELLED

    parcel?.statusHistory.push({
        status: PARCEL_STATUS.CANCELLED,
        updatedBy: decodedToken.userId,
        notes: "Cancelled by sender"
    })

    await parcel!.save();

    return parcel
}

const trackParcel = async (trackingId: string) => {
    const parcel = await Parcel.findOne({ trackingId }).populate({ path: 'statusHistory.updatedBy', select: 'name role' });
    if (!parcel) {
        throw new AppError(404, "Parcel not found")
    }
    return parcel
}

const updateParcelStatus = async (decodedToken: JwtPayload, parcelId: string, payload: Partial<IStatusLog>) => {
    // console.log(payload);
    const parcel = await Parcel.findById(parcelId);

    if (!parcel) {
        throw new AppError(404, "Parcel not found")
    }
    // eta arektu buje tarpor uncomment krbo loggical mone hoile
    // if (parcel.currentStatus === PARCEL_STATUS.CANCELLED) {
    //     throw new AppError(401, "The Parcel you are trying to update is cancelled by its sender")
    // }

    if (!payload.status) {
        throw new AppError(400, "Status is required to update parcel status");
    }

    // preventing pushing same obj with same status
    const lastStatus = parcel.statusHistory[parcel.statusHistory.length - 1];
    if (lastStatus?.status === payload.status) {
        throw new AppError(400, "Parcel already has this status")
    }


    const updatedStatusHistory = {
        ...payload,
        updatedBy: decodedToken.userId
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
            $set: {
                currentStatus: payload.status
            },
            $push: {
                statusHistory: updatedStatusHistory
            }
        }, { new: true, runValidators: true })
    console.log(updatedParcel);
    return updatedParcel

}

export const ParcelServices = {
    createParcel,
    getAllParcel,
    getSingleParcelById,
    cancelParcel,
    trackParcel,
    updateParcelStatus
}

// asif@mail.com asif@mail2.com john@example.com john@example5.com
