import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const adminSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  ghanaCard: {
    type: [String],
    required: true,
    validate: {
      validator: val => val.length >= 1 && val.length <= 2,
      message: 'Upload 1 or 2 Ghana Card images',
    },
  },

  // ✅ New editable fields
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
    enum: ['admin'],
    default: 'admin',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

adminSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

adminSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

adminSchema.plugin(normalize);
export default adminSchema;
