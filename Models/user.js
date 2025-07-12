import mongoose from 'mongoose';
import userSchema from '../Schemas/userSchema.js';

// export default mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User; // Export the model, not just the schema