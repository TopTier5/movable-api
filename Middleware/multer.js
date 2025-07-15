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
    // Set dynamic folder name based on the field
    let folder = 'movable/general';
    if (file.fieldname === 'ghanaCard') folder = 'movable/ghanaCard';
    if (file.fieldname === 'medicalRecords') folder = 'movable/medicalRecords';
    if (file.fieldname === 'driverLicense') folder = 'movable/driverLicense';

    return {
      folder,
      resource_type: 'auto', // auto = handles pdf, image, etc.
      allowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png, and .pdf files are allowed.'));
    }
  },
});

export default upload;
