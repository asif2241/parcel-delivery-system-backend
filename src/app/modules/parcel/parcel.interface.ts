import { Types } from "mongoose";

export interface IStatusLog {
    status: string,
    updatedBy?: Types.ObjectId,
    location?: string,
    notes?: string
}


export enum PARCEL_STATUS {
    REQUESTED = "REQUESTED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED"
}

export interface IParcel {
    trackingId: string,
    sender: Types.ObjectId,
    receiver: {
        name: string,
        email: string,
        phone: string,
        address: string
    },
    parcelType: string,
    parcelImg?: string[],
    weight: number,
    fee: number,
    currentStatus: PARCEL_STATUS
    statusHistory: IStatusLog[];
}
