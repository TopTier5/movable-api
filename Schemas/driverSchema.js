import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const driverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+233\d{9}$/, 'Phone number must be in +233XXXXXXXXX format'],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  email: {
  type: String,
  trim: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
},
  driverLicense: {
    type: [String],
    required: true,
    validate: {
      validator: val => val.length >= 1 && val.length <= 2,
      message: 'Upload 1 or 2 images of driver’s license',
    },
  },

  // ✅ New editable fields for profile update
  address: {
    type: String,
    trim: true,
  },
  emergencyContactName: {
    type: String,
    trim: true,
  },
  emergencyContactPhone: {
    type: String,
    match: [/^\+233\d{9}$/, 'Phone number must be in +233XXXXXXXXX format'],
  },

  role: {
    type: String,
    enum: ['driver'],
    default: 'driver',
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Clean up _id and version key from JSON output
driverSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

driverSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

driverSchema.plugin(normalize);

export default driverSchema;
