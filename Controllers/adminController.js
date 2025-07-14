// Controllers/adminController.js
import Admin from '../Models/adminModel.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../Utils/cloudinaryConfig.js';

export const registerAdmin = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body;

    if (!fullName || !phoneNumber || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (!req.files?.ghanaCard || req.files.ghanaCard.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ghana Card image(s) are required',
      });
    }

    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload Ghana Card to Cloudinary
    const uploadedCard = await Promise.all(
      req.files.ghanaCard.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'movable/admins/ghanaCard',
        })
      )
    );
    const ghanaCardUrls = uploadedCard.map(file => file.secure_url);

    const newAdmin = await Admin.create({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      ghanaCard: ghanaCardUrls,
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: newAdmin,
    });
  } catch (err) {
    console.error('Register Admin Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
