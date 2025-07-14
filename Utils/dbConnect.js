// // Utils/dbConnect.js
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     // MODIFIED LINE: Changed the console log message
//     console.log(`MongoDB Connected successfully.`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`); // Slightly more descriptive error
//     process.exit(1);
//   }
// };

// export default connectDB;