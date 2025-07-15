// // testCloudinary.js
// import dotenv from 'dotenv';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs/promises';

// // Load environment variables and log what dotenv loads
// const envConfig = dotenv.config();

// if (envConfig.error) {
//   console.error("Error loading .env file:", envConfig.error);
// } else {
//   console.log("dotenv successfully loaded the following variables:");
//   // Filter for Cloudinary specific variables for clarity
//   const cloudinaryEnv = Object.keys(process.env)
//     .filter(key => key.startsWith('CLOUDINARY_'))
//     .reduce((obj, key) => {
//       obj[key] = process.env[key];
//       return obj;
//     }, {});
//   console.log(cloudinaryEnv);
// }

// // Configure Cloudinary using credentials from .env
// // We'll also log the values being passed to Cloudinary for verification
// const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
// const apiKey = process.env.CLOUDINARY_API_KEY;
// const apiSecret = process.env.CLOUDINARY_API_SECRET;

// console.log("\nAttempting to configure Cloudinary with:");
// console.log(`  cloud_name: ${cloudName ? '*****' : 'NOT FOUND'}`); // Mask for security
// console.log(`  api_key:    ${apiKey ? '*****' : 'NOT FOUND'}`);    // Mask for security
// console.log(`  api_secret: ${apiSecret ? '*****' : 'NOT FOUND'}`); // Mask for security

// cloudinary.config({
//   cloud_name: cloudName,
//   api_key: apiKey,
//   api_secret: apiSecret,
// });

// async function testCloudinaryUpload() {
//   const testFilePath = './test_image.png';
//   const testPublicId = `test_upload_${Date.now()}`;

//   try {
//     // 1. Create a dummy image file for testing
//     // (In a real scenario, you'd use a real image, but this ensures a file exists)
//     // This is a minimal PNG header for a 1x1 black pixel. Just enough to be a valid PNG.
//     const dummyPngBuffer = Buffer.from([
//       0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
//       0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
//       0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
//       0x0c, 0x49, 0x44, 0x41, 0x54, 0x78, 0xda, 0xed, 0xc1, 0x01, 0x01, 0x00,
//       0x00, 0x00, 0xc2, 0xa0, 0xf7, 0x4f, 0x6d, 0x00, 0x00, 0x00, 0x00, 0x49,
//       0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
//     ]);
//     await fs.writeFile(testFilePath, dummyPngBuffer);
//     console.log(`\nCreated dummy file: ${testFilePath}`);

//     // 2. Attempt to upload the dummy file
//     console.log('Attempting to upload to Cloudinary...');
//     const result = await cloudinary.uploader.upload(testFilePath, {
//       public_id: testPublicId,
//       folder: 'test_folder_movable',
//       resource_type: 'image',
//     });

//     console.log('--- Cloudinary Upload Successful! ---');
//     console.log('URL:', result.secure_url);
//     console.log('Public ID:', result.public_id);
//     console.log('Visit Cloudinary dashboard to verify: https://cloudinary.com/console/media_library');

//     // 3. Clean up: Delete the uploaded file from Cloudinary (optional, but good practice)
//     console.log('Deleting test file from Cloudinary...');
//     await cloudinary.uploader.destroy(testPublicId);
//     console.log('Test file deleted from Cloudinary.');

//   } catch (error) {
//     console.error('--- Cloudinary Upload FAILED! ---');
//     console.error('Error details:', error);
//     if (error.http_code === 401 || error.http_code === 403) {
//         console.error('Authentication Error: Your CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET might be incorrect or your Cloud Name is wrong.');
//         console.error('Please double-check your .env file values against your Cloudinary Dashboard.');
//     } else if (error.code === 'ENOTFOUND') {
//         console.error('Network Error: Could not connect to Cloudinary. Check your internet connection or DNS settings.');
//     } else if (error.message && error.message.includes("api_key")) {
//         console.error("Critical: Cloudinary specifically states 'api_key' is missing. This means process.env.CLOUDINARY_API_KEY was likely undefined or empty when cloudinary.config was called.");
//     }
//   } finally {
//     // Clean up: Delete the local dummy file
//     try {
//       await fs.unlink(testFilePath);
//       console.log(`Deleted local dummy file: ${testFilePath}`);
//     } catch (cleanUpError) {
//       console.error('Error deleting local test file:', cleanUpError);
//     }
//   }
// }

// testCloudinaryUpload();