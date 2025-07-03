import mongoose from "mongoose"; // Import mongoose library for MongoDB interaction

// Async function to connect to MongoDB
const connectDB = async () => {

    // Event listener for successful connection
    mongoose.connection.on('connected', () => console.log("Database connected"));

    // Connect to MongoDB using the URI from environment variables, appending the database name 'mern-auth'
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
};

export default connectDB; // Export the connectDB function as default
