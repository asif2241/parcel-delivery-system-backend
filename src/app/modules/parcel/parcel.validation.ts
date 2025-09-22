import { z } from "zod"
import { PARCEL_STATUS, PARCEL_TYPE } from "./parcel.interface"

// import { Types } from "mongoose";

// export interface IStatusLog {
//     status: string,
//     updatedBy: Types.ObjectId,
//     location?: string,
//     notes?: string
// }


// export enum PARCEL_STATUS {
//     REQUESTED = "REQUESTED",
//     APPROVED = "APPROVED",
//     PICKED = "PICKED",
//     DISPATCHED = "DISPATCHED",
//     IN_TRANSIT = "IN_TRANSIT",
//     OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
//     DELIVERED = "DELIVERED",
//     RETURNED = "RETURNED",
//     RESCHEDULE = "RESCHEDULE",
//     CANCELLED = "CANCELLED"
// }

// export enum PARCEL_TYPE {
//     DOCUMENT = "DOCUMENT",
//     SMALL_PACKAGE = "SMALL_PACKAGE",
//     MEDIUM_PACKAGE = "MEDIUM_PACKAGE",
//     LARGE_PACKAGE = "LARGE_PACKAGE",
//     FRAGILE = "FRAGILE",
//     PERISHABLE = "PERISHABLE",
//     VALUABLE = "VALUABLE",
//     OVERSIZED = "OVERSIZED",
//     HAZARDOUS = "HAZARDOUS"
// }


// export interface IParcel {
//     trackingId: string,
//     sender: Types.ObjectId,
//     receiver: {
//         name: string,
//         email: string,
//         phone: string,
//         address: string
//     },
//     parcelType: PARCEL_TYPE,
//     weight: number,
//     fee: number,
//     image: string,
//     currentStatus: PARCEL_STATUS
//     statusHistory: IStatusLog[];
// }

const statusLogZodSchema = z.object({
    status: z.string(),
    updatedBy: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional()
})

export const createParcelZodSchema = z.object({
    trackingId: z.string().optional(),
    sender: z.string().optional(),
    receiver: z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string()
    }),
    parcelType: z.enum(Object.values(PARCEL_TYPE) as string[]),
    weight: z.number(),
    fee: z.number().optional(),
    image: z.string().optional(),
    currentStatus: z.enum(Object.values(PARCEL_STATUS) as string[]).optional(),
    statusHistory: statusLogZodSchema.optional()
})



// export const updateParcelZodSchema = z.object({
//     trackingId: z.string().optional(),
//     sender: z.string().optional(),
//     receiver: z.object({
//         name: z.string().optional(),
//         email: z.string().optional(),
//         phone: z.string().optional(),
//         address: z.string().optional()
//     }).optional(),
//     parcelType: z.enum(Object.values(PARCEL_TYPE) as string[]).optional(),
//     weight: z.number().optional(),
//     fee: z.number().optional(),
//     image: z.string().optional(),
//     currentStatus: z.enum(Object.values(PARCEL_STATUS) as string[]).optional(),
//     statusHistory: statusLogZodSchema.optional()
// })