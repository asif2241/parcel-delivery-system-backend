"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
//subdocument for status log
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.PARCEL_STATUS),
        default: parcel_interface_1.PARCEL_STATUS.REQUESTED
    },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String },
    notes: { type: String }
}, {
    timestamps: true,
    versionKey: false
});
const parcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, required: true, unique: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    sender_email: { type: String },
    receiver: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    parcelType: {
        type: String,
        enum: Object.values(parcel_interface_1.PARCEL_TYPE),
        required: true
    },
    weight: { type: Number, required: true },
    fee: { type: Number, required: true },
    image: { type: String, required: true },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.PARCEL_STATUS),
        default: parcel_interface_1.PARCEL_STATUS.REQUESTED
    },
    statusHistory: {
        type: [statusLogSchema],
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
