// Controllers/mapController.js
import axios from 'axios';
import Driver from '../Models/driverModel.js';

export const getDistanceAndTime = async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required.'
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&departure_time=now&key=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== 'OK') {
      return res.status(500).json({
        success: false,
        message: 'Error fetching data from Google Maps API',
        details: data
      });
    }

    const element = data.rows[0].elements[0];

    if (element.status !== 'OK') {
      return res.status(400).json({
        success: false,
        message: 'Unable to get distance and time between points',
        status: element.status
      });
    }

    const result = {
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: element.distance.text,
      duration: element.duration.text,
      duration_in_traffic: element.duration_in_traffic?.text || element.duration.text,
    };

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Distance Matrix error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const findNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.body;

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
