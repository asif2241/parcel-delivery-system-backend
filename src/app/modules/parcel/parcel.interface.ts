import { Types } from "mongoose";

export interface IStatusLog {
    status: string,
    updatedBy: Types.ObjectId,
    location?: string,
    notes?: string
}


export enum PARCEL_STATUS {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    PICKED = "PICKED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    RETURNED = "RETURNED",
    RESCHEDULE = "RESCHEDULE",
    CANCELLED = "CANCELLED"
}

export enum PARCEL_TYPE {
    DOCUMENT = "DOCUMENT",
    SMALL_PACKAGE = "SMALL_PACKAGE",
    MEDIUM_PACKAGE = "MEDIUM_PACKAGE",
    LARGE_PACKAGE = "LARGE_PACKAGE",
    FRAGILE = "FRAGILE",
    PERISHABLE = "PERISHABLE",
    VALUABLE = "VALUABLE",
    OVERSIZED = "OVERSIZED",
    HAZARDOUS = "HAZARDOUS"
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
    parcelType: PARCEL_TYPE,
    parcelImg?: string[],
    weight: number,
    fee: number,
    currentStatus: PARCEL_STATUS
    statusHistory: IStatusLog[];
}
