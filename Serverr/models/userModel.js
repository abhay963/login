import mongoose, { mongo } from "mongoose"; // Import mongoose library

// Define user schema with fields and validation
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name, required
    email: { type: String, required: true, unique: true }, // User's email, required and unique
    password: { type: String, required: true }, // Hashed password, required
    verifyOtp: { type: String, default: '' }, // OTP for account verification, default empty
    verifyOtpExpireAt: { type: Number, default: 0 }, // Expiry timestamp for verification OTP
    isAccountVerified: { type: Boolean, default: false }, // Flag if account is verified

    resetOtp: { type: String, default: '' }, // OTP for password reset, default empty
    resetOtpExpireAt: { type: Number, default: 0 }, // Expiry timestamp for reset OTP
});

// Create or retrieve the user model
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel; // Export the user model
