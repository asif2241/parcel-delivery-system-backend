import { v2 as cloudinary } from "cloudinary"
import { envVars } from "./env"
import AppError from "../errorHelpers/AppError";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET
})



export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp|avif)$/i;

        const match = url.match(regex);

        console.log({ match })

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion failed", error.message)
    }
}

export const cloudinaryUpload = cloudinary