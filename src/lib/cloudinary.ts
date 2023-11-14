import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
const cloudinaryFolderName = process.env.CLOUDINARY_FOLDER_NAME;
export { cloudinary, cloudinaryFolderName };
