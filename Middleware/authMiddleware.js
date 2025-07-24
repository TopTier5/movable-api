import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../Models/user.js';
import Driver from '../Models/driverModel.js';
import Admin from '../Models/adminModel.js';

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const role = decoded.role;
      const id = decoded.id;
      let currentUser;

      // Try loading from respective model
      if (role === 'user') {
        currentUser = await User.findById(id).select('-password');
      } else if (role === 'driver') {
        currentUser = await Driver.findById(id).select('-password');
      } else if (role === 'admin') {
        currentUser = await Admin.findById(id).select('-password');
      } else {
        // fallback: try all models
        currentUser =
          (await User.findById(id).select('-password')) ||
          (await Driver.findById(id).select('-password')) ||
          (await Admin.findById(id).select('-password'));

        if (!currentUser) {
          return res.status(401).json({
            success: false,
            message: 'User not found in any role',
          });
        }
      }

      // ✅ Manually attach the role to the user object
      req.user = {
        ...currentUser.toObject(), // ensures we spread plain object, not Mongoose doc
        role: role, // attach role explicitly from token
      };

      next();
    } catch (err) {
      console.error('Auth Error:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }
};
