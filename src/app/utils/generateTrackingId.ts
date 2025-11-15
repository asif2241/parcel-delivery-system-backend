
// export const generateTrackingId = async () => {
//     const { customAlphabet } = await import("nanoid");
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');

//     const prefix = `TRK-${year}${month}${day}-`;

//     const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
//     const suffix = nanoid();
//     return prefix + suffix
// }

// utils/generateTrackingId.ts
export const generateTrackingId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Generate 6-character random suffix (A-Z, 0-9)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 6; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `TRK-${year}${month}${day}-${suffix}`;
};