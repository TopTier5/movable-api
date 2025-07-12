// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../Models/user.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect 'Bearer token'

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
