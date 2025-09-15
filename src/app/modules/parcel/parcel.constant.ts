import { PARCEL_STATUS } from "./parcel.interface";

export const allowedSortFields = ['createdAt', 'weight', 'fee']

export const nonCancellableStatuses = [
    PARCEL_STATUS.DISPATCHED,
    PARCEL_STATUS.IN_TRANSIT,
    PARCEL_STATUS.OUT_FOR_DELIVERY,
    PARCEL_STATUS.DELIVERED,
    PARCEL_STATUS.RETURNED,
    PARCEL_STATUS.CANCELLED
];