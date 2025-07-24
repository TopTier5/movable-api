import Driver from '../Models/driverModel.js'; // ✅ Changed from User to Driver

const allowedFields = [
  'fullName',
  'phoneNumber',
  'email',
  'address',
  'emergencyContactName',
  'emergencyContactPhone'
];

export const editProfile = async (req, res) => {
  try {
    const { userId } = req.body; // ✅ Changed from req.params to req.body

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await Driver.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Edit Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export default editProfile;
