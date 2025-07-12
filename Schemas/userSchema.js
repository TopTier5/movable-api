// Schemas/userSchema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, default: null },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'driver'], default: 'user' },
  disabilityType: { type: String },
  assistanceDescription: { type: String },
  employmentStatus: { type: Boolean },

  ghanaCard: [
    {
      url: String,
      public_id: String,
      format: String,
      type: String
    }
  ],

  medicalRecords: [
    {
      url: String,
      public_id: String,
      format: String,
      type: String
    }
  ]
}, { timestamps: true });

export default userSchema;
