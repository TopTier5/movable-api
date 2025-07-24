// Controllers/dashboardController.js
import User from '../Models/user.js';
import Driver from '../Models/driverModel.js';
import Ride from '../Models/rideModel.js';

export const getDashboardSummary = async (req, res) => {
  const user = req.user; // Set by protect middleware
  console.log('User from token:', user); // 🔍 Debug log

  try {
    // ADMIN DASHBOARD SUMMARY
    if (user.role === 'admin') {
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalDrivers = await Driver.countDocuments();
      const totalRides = await Ride.countDocuments();

      return res.status(200).json({
        success: true,
        role: 'admin',
        summary: {
          totalUsers,
          totalDrivers,
          totalRides,
        },
      });
    }

    // DRIVER DASHBOARD SUMMARY
    if (user.role === 'driver') {
      const assignedRides = await Ride.find({ driver: user._id }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        role: 'driver',
        summary: {
          totalAssignedRides: assignedRides.length,
          assignedRides,
        },
      });
    }

    // USER DASHBOARD SUMMARY
    if (user.role === 'user') {
      const myRides = await Ride.find({ rider: user._id }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        role: 'user',
        summary: {
          totalRequests: myRides.length,
          lastRide: myRides[0] || null,
        },
      });
    }

    // UNKNOWN ROLE
    return res.status(403).json({
      success: false,
      message: 'Unknown role. Access denied.',
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
