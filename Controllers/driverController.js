// Controllers/driverController.js
import Driver from '../Models/driverModel.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../Utils/cloudinaryConfig.js';

// REGISTER DRIVER
export const registerDriver = async (req, res) => {
  try {
    const { fullName, phoneNumber, password } = req.body;

    if (!fullName || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and password are required.',
      });
    }

    if (!req.files?.driverLicense || req.files.driverLicense.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one driver license image is required.',
      });
    }

    const existingDriver = await Driver.findOne({ phoneNumber });
    if (existingDriver) {
      return res.status(409).json({
        success: false,
        message: 'This phone number is already registered.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadedLicenses = await Promise.all(
      req.files.driverLicense.map(async file => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'movable/drivers/license',
        });
        return result.secure_url;
      })
    );

    const newDriver = await Driver.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      driverLicense: uploadedLicenses,
    });

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully.',
      data: newDriver,
    });
  } catch (error) {
    console.error('Register Driver Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

// UPDATE DRIVER LOCATION
export const updateDriverLocation = async (req, res) => {
  try {
    const { driverId, latitude, longitude } = req.body;

    if (!driverId || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Missing driverId or coordinates.' });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { currentLocation: { type: 'Point', coordinates: [longitude, latitude] } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }

    res.json({
      success: true,
      message: 'Driver location updated.',
      data: driver,
    });
  } catch (error) {
    console.error('Update Driver Location Error:', error);
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// FIND NEARBY DRIVERS
export const findNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, radiusInKm = 10 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Coordinates are required.' });
    }

    const radiusInRadians = radiusInKm / 6378.1;

    const drivers = await Driver.find({
      currentLocation: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    });

    res.json({
      success: true,
      message: 'Nearby drivers found.',
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error('Find Nearby Drivers Error:', error);
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};
