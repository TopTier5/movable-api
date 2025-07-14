// Models/riderModel.js
import mongoose from 'mongoose';
import riderSchema from '../Schemas/riderSchema.js';

const Rider = mongoose.model('Rider', riderSchema);
export default Rider;
