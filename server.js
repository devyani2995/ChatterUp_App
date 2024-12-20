// Import required modules and dependencies
import express from "express"; // Express framework for server setup
import { Server } from "socket.io"; // Socket.IO library for real-time communication
import cors from "cors"; // Middleware to handle Cross-Origin Resource Sharing
import http from "http"; // HTTP module to create the server
import { connect } from "./db.config.js"; // Database connection configuration
import Chat from "./chatter.schema.js"; // Chat schema for MongoDB

const app = express();
app.use(cors()); // Allow requests from all origins


// Create server using http
const server = http.createServer(app);


// Create socket server(the socket server uses the http server to start the communication)
const io = new Server(server, {
    cors: {
        origin: '*',  // Allow all origins
        methods: ["GET", "POST"]  // Allow GET and POST methods
    }
});

// Array to store online users
let onlineUser = [];

// Setup the socket events(Socket programming works on events)
//connection event
io.on('connection', (socket) => {
    console.log("Connection is establised"); // Log when a client connects

    // Event: When a user joins the chat
    socket.on('join', async (name) => {
        // Add the user to the online users list
        onlineUser.push({ id: socket.id, name });
        // Broadcast the updated list of online users to all clients
        io.emit("onlineUser", onlineUser);
        // Fetch and send old messages from the database to the newly connected user
        const oldMessage = await Chat.find();
        socket.emit('oldMessage', oldMessage);
    });

    // Event: User typing
    socket.on('typing', () => {
        // Notify other clients that the user is typing
        io.emit('typing', socket.id);
    });

    // Event: User sends a new message
    socket.on("newMessage", async (newMessage) => {

        // Validate message content
        if (!newMessage.message || !newMessage.name) {
            return;
        }

        // Storing a new chat to the DB
        const newChat = new Chat({
            name: newMessage.name,
            message: newMessage.message,
            time: new Date(),
        });
        const savedChat = await newChat.save() // Save the message to the database

        // Broadcast the new message to all connected clients
        socket.broadcast.emit("boradcastMessage", savedChat);
    });

     // Event: When a user disconnects
    socket.on('disconnect', () => {
        console.log("Connection is disconnected"); // Log when a client disconnects

        // Remove the user from the online users list
        const indexToRemove = onlineUser.findIndex(user => user.id == socket.id);
        onlineUser.splice(indexToRemove, 1); // Remove the user from the array

        // Notify all clients of the updated online users list
        io.emit('onlineUser', onlineUser); 
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log("App is listening on 3000"); // Log when the server starts
    connect(); // Establish connection to the MongoDB database
});