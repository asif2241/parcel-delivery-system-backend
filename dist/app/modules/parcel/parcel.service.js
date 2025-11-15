"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelServices = void 0;
const parcel_interface_1 = require("./parcel.interface");
const generateTrackingId_1 = require("../../utils/generateTrackingId");
const calculateFee_1 = require("../../utils/calculateFee");
const parcel_model_1 = require("./parcel.model");
const user_interface_1 = require("../user/user.interface");
const parcel_constant_1 = require("./parcel.constant");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createParcel = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new AppError(222, "fake error")
    const trackingId = yield (0, generateTrackingId_1.generateTrackingId)();
    const newParcelData = Object.assign(Object.assign({}, payload), { trackingId, fee: (0, calculateFee_1.calculateParcelFee)(payload.weight), senderId: decodedToken.userId, sender_email: decodedToken.email, currentStatus: parcel_interface_1.PARCEL_STATUS.REQUESTED, statusHistory: [{
                status: parcel_interface_1.PARCEL_STATUS.REQUESTED,
                updatedBy: decodedToken.userId,
                notes: "Parcel created"
            }] });
    const parcel = yield parcel_model_1.Parcel.create(newParcelData);
    return parcel;
});
const getAllParcel = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const currentStatus = query.currentStatus;
    const parcelType = query.parcelType;
    const searchEmail = query.searchEmail;
    //safer sorting logic
    const userInputSort = query.sort || "-createdAt";
    const sortField = userInputSort.startsWith('-') ? userInputSort.substring(1) : userInputSort;
    let sort = "-createdAt";
    if (parcel_constant_1.allowedParcelSortFields.includes(sortField)) {
        sort = userInputSort;
    }
    const filter = {};
    if (decodedToken.role === user_interface_1.Role.SENDER) {
        filter.senderId = decodedToken.userId;
    }
    else if (decodedToken.role === user_interface_1.Role.RECEIVER) {
        filter["receiver.email"] = decodedToken.email;
    }
    else if (decodedToken.role === user_interface_1.Role.SUPER_ADMIN || decodedToken.role === user_interface_1.Role.ADMIN) {
        // admin and super admin can view all the parcels,
        // ✅ If admin searched by email
        if (searchEmail) {
            filter.$or = [
                { sender_email: { $regex: searchEmail, $options: "i" } },
                { "receiver.email": { $regex: searchEmail, $options: "i" } },
            ];
        }
    }
    if (currentStatus) {
        filter.currentStatus = currentStatus;
    }
    if (parcelType) {
        filter.parcelType = parcelType;
    }
    const allParcels = yield parcel_model_1.Parcel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    // if (allParcels.length === 0) {
    //     throw new AppError(404, "No Parcel found!!!")
    // }
    const totalParcel = yield parcel_model_1.Parcel.countDocuments(filter);
    const totalPage = Math.ceil(totalParcel / limit);
    const meta = {
        page,
        limit,
        totalPage,
        total: totalParcel
    };
    return {
        data: allParcels,
        meta: meta
    };
});
const getSingleParcelById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    return parcel;
});
const cancelParcel = (decodedToken, id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (decodedToken.userId !== (parcel === null || parcel === void 0 ? void 0 : parcel.senderId.toString())) {
        throw new AppError_1.default(401, "Sorry, you are not authorized to cancel this percel");
    }
    if (parcel_constant_1.nonCancellableStatuses.includes(parcel.currentStatus)) {
        throw new AppError_1.default(400, `Sorry! You cannot cancel parcel. Current status: ${parcel === null || parcel === void 0 ? void 0 : parcel.currentStatus}`);
    }
    parcel.currentStatus = parcel_interface_1.PARCEL_STATUS.CANCELLED;
    parcel === null || parcel === void 0 ? void 0 : parcel.statusHistory.push({
        status: parcel_interface_1.PARCEL_STATUS.CANCELLED,
        updatedBy: decodedToken.userId,
        notes: "Cancelled by sender"
    });
    yield parcel.save();
    return parcel;
});
const trackParcel = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId }).populate({ path: 'statusHistory.updatedBy', select: 'name role' });
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    return parcel;
});
const updateParcelStatus = (decodedToken, parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(payload);
    console.log(parcelId, payload);
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    // eta arektu buje tarpor uncomment krbo loggical mone hoile
    // if (parcel.currentStatus === PARCEL_STATUS.CANCELLED) {
    //     throw new AppError(401, "The Parcel you are trying to update is cancelled by its sender")
    // }
    if (!payload.status) {
        throw new AppError_1.default(400, "Status is required to update parcel status");
    }
    // preventing pushing same obj with same status
    const lastStatus = parcel.statusHistory[parcel.statusHistory.length - 1];
    if ((lastStatus === null || lastStatus === void 0 ? void 0 : lastStatus.status) === payload.status) {
        throw new AppError_1.default(400, "Parcel already has this status");
    }
    const updatedStatusHistory = Object.assign(Object.assign({}, payload), { updatedBy: decodedToken.userId });
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
        $set: {
            currentStatus: payload.status
        },
        $push: {
            statusHistory: updatedStatusHistory
        }
    }, { new: true, runValidators: true });
    // console.log(updatedParcel);
    return updatedParcel;
});
const parcelAnalytics = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    //  Role-based filtering
    if (decodedToken.role === user_interface_1.Role.SENDER) {
        filter.senderId = decodedToken.userId;
    }
    else if (decodedToken.role === user_interface_1.Role.RECEIVER) {
        filter["receiver.email"] = decodedToken.email;
    }
    const parcels = yield parcel_model_1.Parcel.find(filter);
    const total = parcels.length;
    // define transit-related statuses
    const inTransitStatuses = [
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "PICKED",
        "DISPATCHED",
    ];
    // ✅ Count by status
    const delivered = parcels.filter(p => p.currentStatus === parcel_interface_1.PARCEL_STATUS.DELIVERED).length;
    const cancelled = parcels.filter(p => p.currentStatus === parcel_interface_1.PARCEL_STATUS.CANCELLED).length;
    const inTransit = parcels.filter(p => inTransitStatuses.includes(p.currentStatus)).length;
    const pending = parcels.filter(p => p.currentStatus === parcel_interface_1.PARCEL_STATUS.REQUESTED || p.currentStatus === parcel_interface_1.PARCEL_STATUS.APPROVED).length;
    const returned = parcels.filter(p => p.currentStatus === parcel_interface_1.PARCEL_STATUS.RETURNED).length;
    const rescheduled = parcels.filter(p => p.currentStatus === parcel_interface_1.PARCEL_STATUS.RESCHEDULE).length;
    // ✅ Status distribution
    // const statusDistributionMap: Record<string, number> = {};
    // parcels.forEach(p => {
    //     statusDistributionMap[p.currentStatus] =
    //         (statusDistributionMap[p.currentStatus] || 0) + 1;
    // });
    // const statusDistribution = Object.entries(statusDistributionMap).map(
    //     ([status, count]) => ({ status, count })
    // );
    // ✅ Monthly counts (last 6 months)
    const now = new Date();
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const monthCount = parcels.filter(p => {
            var _a;
            const createdAt = new Date((_a = p.createdAt) !== null && _a !== void 0 ? _a : new Date());
            return (createdAt.getMonth() === date.getMonth() &&
                createdAt.getFullYear() === date.getFullYear());
        }).length;
        monthly.push({ month: `${monthName} ${year}`, count: monthCount });
    }
    return {
        total,
        delivered,
        inTransit,
        cancelled,
        pending,
        returned,
        rescheduled,
        monthly,
        // statusDistribution,
    };
});
exports.ParcelServices = {
    createParcel,
    getAllParcel,
    getSingleParcelById,
    cancelParcel,
    trackParcel,
    updateParcelStatus,
    parcelAnalytics
};
// asif@mail.com asif@mail2.com john@example.com john@example5.com
