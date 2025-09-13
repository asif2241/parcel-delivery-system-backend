import { customAlphabet } from "nanoid"
export const generateTrackingId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const prefix = `TRK-${year}${month}${day}-`;

    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    const suffix = nanoid();
    return prefix + suffix
}