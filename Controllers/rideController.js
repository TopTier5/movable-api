// Controllers/rideController.js
import Ride from '../Models/rideModel.js';

export const requestRide = async (req, res) => {
  try {
    const { userId, origin, destination, assistanceNeeded, status = 'pending' } = req.body;

    if (!userId || !origin || !destination) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const newRide = new Ride({
      user: userId,
      origin,
      destination,
      assistanceNeeded,
      status,
    });

    const savedRide = await newRide.save();

    res.status(201).json({ success: true, ride: savedRide });
  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({ success: false, message: 'Failed to request ride', error: error.message });
  }
};
