
import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, PARCEL_STATUS, PARCEL_TYPE } from "./parcel.interface";

//subdocument for status log
const statusLogSchema = new Schema<IStatusLog>({
    status: {
        type: String,
        enum: Object.values(PARCEL_STATUS),
        default: PARCEL_STATUS.REQUESTED
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String },
    notes: { type: String }
}, {
    timestamps: true,
    versionKey: false
})


const parcelSchema = new Schema<IParcel>({
    trackingId: { type: String, required: true, unique: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    parcelType: {
        type: String,
        enum: Object.values(PARCEL_TYPE),
        required: true
    },
    weight: { type: Number, required: true },
    fee: { type: Number, required: true },
    image: { type: String, required: true },
    currentStatus: {
        type: String,
        enum: Object.values(PARCEL_STATUS),
        default: PARCEL_STATUS.REQUESTED
    },
    statusHistory: {
        type: [statusLogSchema],

    }
}, {
    timestamps: true,
    versionKey: false
})

export const Parcel = model<IParcel>("Parcel", parcelSchema)