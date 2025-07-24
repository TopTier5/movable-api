// Controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../Models/user.js';
import Driver from '../Models/driverModel.js';
import Admin from '../Models/adminModel.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper: sanitize user before sending in response
const sanitizeUser = user => {
  const obj = user.toObject?.() || { ...user };
  delete obj.password;
  return obj;
};

// REGISTER: USER (RIDE REQUESTER)
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      password,
      address,
      typeOfDisability,
      assistanceNeeds,
    } = req.body;

    if (!req.files?.ghanaCard?.length) {
      return res.status(400).json({ success: false, message: 'Ghana Card file required' });
    }
    if (!req.files?.medicalRecords?.length) {
      return res.status(400).json({ success: false, message: 'Medical Records required' });
    }

    const ghanaCardFiles = req.files.ghanaCard.map(file => file.path);
    const medicalRecords = req.files.medicalRecords.map(file => file.path);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      phoneNumber,
      password: hashedPassword,
      address,
      typeOfDisability,
      assistanceNeeds,
      ghanaCard: ghanaCardFiles,
      medicalRecords,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: sanitizeUser(newUser),
      token,
    });
  } catch (err) {
    console.error('User registration error:', err);
    res.status(500).json({ success: false, message: 'User registration failed', error: err.message });
  }
};

// REGISTER: DRIVER
export const registerDriver = async (req, res) => {
  try {
    const { fullName, phoneNumber, password } = req.body;

    if (!req.files?.driverLicense?.length) {
      return res.status(400).json({ success: false, message: 'Driver License required' });
    }

    const driverLicenseFiles = req.files.driverLicense.map(file => file.path);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDriver = new Driver({
      fullName,
      phoneNumber,
      password: hashedPassword,
      driverLicense: driverLicenseFiles,
    });

    await newDriver.save();

    const token = jwt.sign({ id: newDriver._id, role: 'driver' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      data: sanitizeUser(newDriver),
      token,
    });
  } catch (err) {
    console.error('Driver registration error:', err);
    res.status(500).json({ success: false, message: 'Driver registration failed', error: err.message });
  }
};

// REGISTER: ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: sanitizeUser(newAdmin),
      token,
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ success: false, message: 'Admin registration failed', error: err.message });
  }
};

// LOGIN: Universal for User, Driver, Admin
export const loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ success: false, message: 'Phone number and password are required' });
    }

    const user =
      (await User.findOne({ phoneNumber }).select('+password')) ||
      (await Driver.findOne({ phoneNumber }).select('+password')) ||
      (await Admin.findOne({ phoneNumber }).select('+password'));

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.password || typeof user.password !== 'string') {
      return res.status(500).json({ success: false, message: 'Password hash missing or invalid in user record' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const role =
      user instanceof User ? 'user' :
      user instanceof Driver ? 'driver' :
      'admin';

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      data: sanitizeUser(user),
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};
