// Controllers/bookingController.js
import Booking from '../Models/bookingModel.js';
// import Driver from '../Models/driverModel.js';

export const createBooking = async (req, res) => {
  try {
    const { userId, origin, destination, assistanceNeeded } = req.body;

    if (!userId || !origin || !destination) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const booking = new Booking({
      userId,
      origin,
      destination,
      assistanceNeeded: assistanceNeeded || false,
      status: 'pending',
    });

    const saved = await booking.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ success: false, message: 'Booking failed.', error: error.message });
  }
};
