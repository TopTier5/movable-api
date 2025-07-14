// Controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/user.js';
import Rider from '../Models/riderModel.js';
import Admin from '../Models/adminModel.js';

// ========== REGISTER USER ==========
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      password,
      email,
      typeOfDisability,
      assistanceNeeds,
      employmentStatus
    } = req.body;

    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ghanaCard = (req.files['ghanaCard'] || []).map(file => file.path);
    const medicalRecords = (req.files['medicalRecords'] || []).map(file => file.path);

    if (ghanaCard.length < 1 || ghanaCard.length > 2) {
      return res.status(400).json({ success: false, message: 'Upload 1 or 2 Ghana Card images' });
    }

    const newUser = await User.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      email,
      ghanaCard,
      medicalRecords,
      typeOfDisability,
      assistanceNeeds,
      employmentStatus,
      role: 'user'
    });

    const token = jwt.sign({ id: newUser.id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      token,
    });
  } catch (err) {
    console.error('User Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ========== REGISTER RIDER ==========
export const registerRider = async (req, res) => {
  try {
    const { fullName, phoneNumber, password } = req.body;

    const existing = await Rider.findOne({ phoneNumber });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const driverLicense = (req.files['driverLicense'] || []).map(file => file.path);

    if (driverLicense.length < 1 || driverLicense.length > 2) {
      return res.status(400).json({ success: false, message: 'Upload 1 or 2 Driver’s License images' });
    }

    const newRider = await Rider.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      driverLicense,
      role: 'rider'
    });

    const token = jwt.sign({ id: newRider.id, role: 'rider' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'Rider registered successfully',
      rider: newRider,
      token,
    });
  } catch (err) {
    console.error('Rider Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ========== REGISTER ADMIN ==========
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body;

    const existing = await Admin.findOne({ phoneNumber });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const ghanaCard = (req.files['ghanaCard'] || []).map(file => file.path);

    if (ghanaCard.length < 1 || ghanaCard.length > 2) {
      return res.status(400).json({ success: false, message: 'Upload 1 or 2 Ghana Card images' });
    }

    const newAdmin = await Admin.create({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      ghanaCard,
      role: 'admin'
    });

    const token = jwt.sign({ id: newAdmin.id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: newAdmin,
      token,
    });
  } catch (err) {
    console.error('Admin Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ========== LOGIN (ALL ROLES) ==========
export const loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required',
      });
    }

    let user =
      await Admin.findOne({ phoneNumber }) ||
      await Rider.findOne({ phoneNumber }) ||
      await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
