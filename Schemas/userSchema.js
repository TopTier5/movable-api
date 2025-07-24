import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
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
  lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  ghanaCard: {
    type: [String],
    required: true,
    validate: {
      validator: val => val.length >= 1 && val.length <= 2,
      message: 'Upload 1 or 2 Ghana Card images',
    },
  },
  medicalRecords: {
    type: [String],
  },
  typeOfDisability: {
    type: String,
    required: true,
  },
  assistanceNeeds: {
    type: String,
    required: true,
  },
  employmentStatus: {
    type: String,
    enum: ['employed', 'unemployed'],
  },

  // New editable profile fields
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

  // Role update: changed 'rider' to 'driver'
  role: {
    type: String,
    enum: ['user', 'admin', 'driver'],
    default: 'user',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.plugin(normalize);
export default userSchema;
