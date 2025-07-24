// Routes/driverRoutes.js
import express from 'express';
import {
  registerDriver,
  updateDriverLocation,
  findNearbyDrivers,
} from '../Controllers/driverController.js';
import upload from '../Middleware/multer.js'; // handles file uploads

const router = express.Router();

// Register new driver with license upload
router.post(
  '/register',
  upload.fields([{ name: 'driverLicense', maxCount: 3 }]),
  registerDriver
);

// Driver location update
router.post('/update-location', updateDriverLocation);

// Find nearby drivers
router.post('/nearby', findNearbyDrivers);

export default router;
