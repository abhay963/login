import express from 'express'; // Import Express framework
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js'; // Import authentication controller functions
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router(); // Create a new router instance

// Define POST route for user registration
authRouter.post('/register', register);

// Define POST route for user login
authRouter.post('/login', login);

// Define POST route for user logout
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth,sendVerifyOtp);
authRouter.post('/verify-account', userAuth,verifyEmail);
authRouter.get('/is-auth', userAuth,isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password',resetPassword);

export default authRouter; // Export the router for use in server.js
