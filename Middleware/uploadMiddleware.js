// middleware/uploadMiddleware.js
import multer from 'multer';

// Use memoryStorage: files go straight to RAM (not saved to disk)
const upload = multer({ storage: multer.memoryStorage() });

// Define accepted file fields
export const userUploadMiddleware = upload.fields([
  { name: 'ghanaCard', maxCount: 2 },
  { name: 'medicalRecords', maxCount: 5 }
]);
