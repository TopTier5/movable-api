import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
  type: String,
  trim: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
},
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  driverLicense: {
    type: Object, // { url, public_id }
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    }
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

driverSchema.index({ location: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
