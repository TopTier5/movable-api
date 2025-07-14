// Schemas/riderSchema.js
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const riderSchema = new mongoose.Schema({
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
    minlength: 6,
  },
  driverLicense: {
    type: [String],
    required: true,
    validate: {
      validator: val => val.length >= 1 && val.length <= 2,
      message: 'Upload 1 or 2 images of driver’s license',
    },
  },
  role: {
    type: String,
    enum: ['rider'],
    default: 'rider',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

riderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

riderSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

riderSchema.plugin(normalize);
export default riderSchema;
