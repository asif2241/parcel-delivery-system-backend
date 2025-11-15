"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
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
const statusLogZodSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(parcel_interface_1.PARCEL_STATUS, {
        invalid_type_error: "Invalid Status"
    })
        .optional(),
    updatedBy: zod_1.z.string().optional(),
    location: zod_1.z.string({
        invalid_type_error: "Location must be String"
    })
        .min(2, { message: "Location must be at least 2 characters long" })
        .max(50, { message: "Location cannot exceed 50 characters" })
        .optional(),
    notes: zod_1.z.string({
        invalid_type_error: "Notes must be String"
    })
        .min(5, { message: "Notes must be at least 2 characters long" })
        .max(50, { message: "Notes cannot exceed 50 characters" })
        .optional()
});
exports.createParcelZodSchema = zod_1.z.object({
    trackingId: zod_1.z.string().optional(),
    senderId: zod_1.z.string().optional(),
    sender_email: zod_1.z.string().optional(),
    receiver: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Receiver name required!",
            invalid_type_error: "Receiver name not in string format!"
        })
            .min(3, { message: "Receiver name must be at least 3 characters long!" })
            .max(20, { message: "Receiver name cannot exceed 20 characters!" }),
        email: zod_1.z
            .string({
            required_error: "Receivers email required!",
            invalid_type_error: "Email must be String!"
        })
            .email({ message: "Invalid Email Format!" }),
        phone: zod_1.z
            .string({
            required_error: "Receivers phone number required!",
            invalid_type_error: "Phone number must be string!"
        })
            .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
        address: zod_1.z.string()
    }),
    parcelType: zod_1.z.nativeEnum(parcel_interface_1.PARCEL_TYPE, {
        invalid_type_error: "Invalid Parcel Type!"
    }),
    weight: zod_1.z.number({
        required_error: "Weight is required",
        invalid_type_error: "Weight must be in Number"
    }),
    fee: zod_1.z.number({
        invalid_type_error: "Fee must be in Number"
    }).optional(),
    image: zod_1.z.string({}).optional(),
    currentStatus: zod_1.z.nativeEnum(parcel_interface_1.PARCEL_STATUS, {
        invalid_type_error: "Invalid Status"
    }).optional(),
    statusHistory: statusLogZodSchema.optional()
});
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
