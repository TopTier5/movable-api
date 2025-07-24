// Controllers/nearbyController.js
import Driver from '../Models/driverModel.js';

export const findNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.body; // radius in meters

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude required.' });
    }

    const nearbyDrivers = await Driver.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        }
      }
    });

    res.status(200).json({ success: true, drivers: nearbyDrivers });
  } catch (error) {
    console.error('Nearby Drivers Error:', error);
    res.status(500).json({ success: false, message: 'Failed to find nearby drivers.', error: error.message });
  }
};
