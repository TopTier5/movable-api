// Middleware/multer.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'movable/uploads';

    if (file.fieldname === 'ghanaCard') {
      folder = 'movable/ghanaCard';
    } else if (file.fieldname === 'medicalRecords') {
      folder = 'movable/medicalRecords';
    } else if (file.fieldname === 'driverLicense') {
      folder = 'movable/riders/license';
    } else if (file.fieldname === 'adminGhanaCard') {
      folder = 'movable/admins/ghanaCard';
    }

    return {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    };
  },
});

const upload = multer({ storage });

export default upload;

