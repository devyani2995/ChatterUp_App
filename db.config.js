// Importing Mongoose, a library for MongoDB to manage connections and schemas
import mongoose from "mongoose";

// Function to establish connection to MongoDB
export const connect = async () => {
    try {
        // Connect to the MongoDB instance using the provided URI and options
        await mongoose.connect("mongodb://localhost:27017/chatterUp", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully.');// Logs a message if the connection is successful
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message); // Logs an error message if the connection fails
        process.exit(1); // Exit the process with failure   
    }
}