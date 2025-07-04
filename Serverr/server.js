import express from "express"; // Import Express framework for building the server
import cors from "cors"; // Import CORS middleware to enable Cross-Origin Resource Sharing
import 'dotenv/config'; // Load environment variables from .env file
import cookieParser from "cookie-parser"; // Middleware to parse cookies from HTTP requests
import connectDB from "./config/mongodb.js"; // Import MongoDB connection function
import authRouter from './routes/authRoutes.js' // Import authentication routes
import userRouter from "./routes/userRoutes.js";

const app = express(); // Create an Express application instance
const port = process.env.PORT || 3000; // Define the port to listen on, default to 3000 if not set
connectDB(); // Connect to MongoDB database

app.use(express.json()); // Middleware to parse JSON bodies from incoming requests
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({ credentials: true })); // Enable CORS with credentials support

// API ENDPOINTS

// Root endpoint to check if API is working
app.get('/', (req, res) => {
    res.send("API working ");
});

// Mount authentication routes under /api/auth
app.use('/api/auth', authRouter);
app.use('/api/auth/user', userRouter);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server started on port:${port}`);
    // Warn if MongoDB URI is not set in environment variables
    if (!process.env.MONGODB_URI) {
        console.error("Warning: MONGODB_URI is not set in environment variables.");
    }
});
