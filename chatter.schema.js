// Importing Mongoose, a library for MongoDB to manage connections and schemas
import mongoose from "mongoose";

// Define the schema for storing chat messages and user information
const chatterSchema = new mongoose.Schema({
  name: String, // Name of the user sending the message
  message: String, // Content of the chat message
  time: Date, // Timestamp of when the message was sent
});

// Create a model from the schema,representing the "Chat" collection in MongoDB
const Chat = mongoose.model("Chat", chatterSchema);

// Export the model for use in other parts of the application
export default Chat;