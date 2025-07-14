// Controllers/riderController.js
import Rider from '../Models/riderModel.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../Utils/cloudinaryConfig.js';

export const registerRider = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      password,
    } = req.body;

    if (!fullName || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and password are required',
      });
    }

    if (!req.files?.driverLicense || req.files.driverLicense.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Driver license image(s) are required',
      });
    }

    const existingRider = await Rider.findOne({ phoneNumber });
    if (existingRider) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload driver license images to Cloudinary
    const uploadedLicense = await Promise.all(
      req.files.driverLicense.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'movable/riders/license',
        })
      )
    );
    const licenseUrls = uploadedLicense.map(file => file.secure_url);

    const newRider = await Rider.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      driverLicense: licenseUrls,
    });

    res.status(201).json({
      success: true,
      message: 'Rider registered successfully',
      rider: newRider,
    });
  } catch (err) {
    console.error('Register Rider Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
