// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../Models/user.js';
import cloudinary from '../Utils/cloudinaryConfig.js';

// 📦 Validate user input
const signupSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow('', null),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin', 'driver').default('user'),
  disabilityType: Joi.string().optional(),
  assistanceDescription: Joi.string().optional(),
  employmentStatus: Joi.boolean().optional()
});

// ✨ Register a new user
export const registerUser = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
      name, phone, email, password, role,
      disabilityType, assistanceDescription, employmentStatus
    } = value;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(409).json({ message: 'Phone number already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🌩 Upload Ghana Card (up to 2 files)
    let ghanaCardDocs = [];
    if (req.files?.ghanaCard) {
      for (const file of req.files.ghanaCard) {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'movable/ghanaCard',
              resource_type: 'auto'
            },
            (err, result) => {
              if (err) reject(err);
              else resolve({
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                type: result.resource_type
              });
            }
          );
          stream.end(file.buffer);
        });

        const result = await uploadPromise;
        ghanaCardDocs.push(result);
      }
    }

    // 🏥 Upload medical records
    let medicalRecords = [];
    if (req.files?.medicalRecords) {
      for (const file of req.files.medicalRecords) {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'movable/medicalRecords',
              resource_type: 'auto'
            },
            (err, result) => {
              if (err) reject(err);
              else resolve({
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                type: result.resource_type
              });
            }
          );
          stream.end(file.buffer);
        });

        const result = await uploadPromise;
        medicalRecords.push(result);
      }
    }

    // 👤 Create new user
    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
      disabilityType,
      assistanceDescription,
      employmentStatus,
      ghanaCard: ghanaCardDocs,
      medicalRecords
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered and logged in',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// 🔑 Log in user
export const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 🚪 Log out user
export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};
