"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = void 0;
const nanoid_1 = require("nanoid");
const generateTrackingId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const prefix = `TRK-${year}${month}${day}-`;
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    const suffix = nanoid();
    return prefix + suffix;
};
exports.generateTrackingId = generateTrackingId;
