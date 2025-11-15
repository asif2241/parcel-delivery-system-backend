"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonCancellableStatuses = exports.allowedParcelSortFields = void 0;
const parcel_interface_1 = require("./parcel.interface");
exports.allowedParcelSortFields = ['createdAt', 'weight', 'fee'];
exports.nonCancellableStatuses = [
    parcel_interface_1.PARCEL_STATUS.DISPATCHED,
    parcel_interface_1.PARCEL_STATUS.IN_TRANSIT,
    parcel_interface_1.PARCEL_STATUS.OUT_FOR_DELIVERY,
    parcel_interface_1.PARCEL_STATUS.DELIVERED,
    parcel_interface_1.PARCEL_STATUS.RETURNED,
    parcel_interface_1.PARCEL_STATUS.CANCELLED
];
