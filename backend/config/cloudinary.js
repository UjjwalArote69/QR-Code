import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 1. Explicitly handle PDFs
    if (file.mimetype === 'application/pdf') {
      return {
        folder: 'nexusqr_uploads',
        format: 'pdf', 
        resource_type: 'image', 
      };
    }
    
    // 2. NEW: Explicitly handle Videos
    if (file.mimetype.startsWith('video/')) {
      return {
        folder: 'nexusqr_uploads',
        resource_type: 'video', // Cloudinary requires this for mp4, webm, etc.
        allowed_formats: ['mp4', 'webm', 'mov', 'ogg']
      };
    }
    
    // 3. Handle standard Images
    return {
      folder: 'nexusqr_uploads',
      allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
      resource_type: 'image'
    };
  },
});

export const upload = multer({ storage: storage });