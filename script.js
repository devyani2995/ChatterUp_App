// Connect to the server using Socket.IO
const socket = io.connect("http://localhost:3000");

// Get references to DOM elements for user interaction
const myPrompt = document.getElementById("my-prompt");
const userName = document.getElementById("name");
const message = document.getElementById("text-message");
const sendMessage = document.getElementById("message-form");

// Display the user prompt for entering a name when the page loads
document.addEventListener("DOMContentLoaded", () => {
    myPrompt.style.display = "flex";
});

// Handle the event when the user submits their name
myPrompt.addEventListener("submit", (event) => {
    event.preventDefault();
    const welcome = document.getElementById("welcome");
    welcome.innerText = "Welcome, " + userName.value;  // Display a welcome message
    myPrompt.style.display = "none";  // Hide the prompt form
    // Emit the 'join' event to the server with the user's name
    socket.emit("join", userName.value);
});


// Listen for the "onlineUser" event and update the list of online users
socket.on("onlineUser", (users) => {
    const onlineUser = document.getElementById("online-user");
    onlineUser.innerHTML = "";
    const count = document.getElementById("count"); 
    count.innerText = "Online(" + users.length + ")"; // Display the count of online users
    // Iterate through the list of users and add them to the online users section
    users.forEach((user) => {
        const newUser = document.createElement("div");
        newUser.innerHTML = `   <div class="user">
                            <img src="images/1.jpg" alt="R">
                            <p>${user.name}</p>
                            <span class="online-dot"></span>
                            <p id="${user.id}" class="typing"><p>
        
                    </div>`;
        onlineUser.appendChild(newUser);
    });
});

// Listen for "oldMessage" event and display the previous chat messages
socket.on("oldMessage", (oldMessage) => {

    const messageList = document.getElementById("message-list");

    oldMessage.forEach((message) => {
        const oldmsg = document.createElement("div");
        const timestamp = new Date(message.time); // Convert the timestamp to a Date object
        // Differentiate the style for the user's own messages
        if (message.name == userName.value) {
            oldmsg.innerHTML = `

            <div class="message-block-user">
                <img src="images/1.jpg" alt="pic">
                <div class="message-content" style="background-color: #E91E63; color: white;">
                    <p class="name" style="color:white; font-weight: bold; margin-bottom: 15px;">${message.name
                }</p>
                    <p class="message">${message.message}</p>
                    <p class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</p>
                </div>
            </div>`;
            messageList.appendChild(oldmsg);
        } else {
            oldmsg.innerHTML = `
            <div class="message-block">
                <img src="images/1.jpg" alt="pic">
                <div class="message-content">
                    <p class="name">${message.name}</p>
                    <p class="message">${message.message}</p>
                    <p class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</p>
                </div>
            </div>`;
            messageList.appendChild(oldmsg); // Add the message to the message list
        }
    });
    scrollToBottom();
});

// Emit a "typing" event when the user starts typing a message
message.addEventListener("input", () => {
    socket.emit("typing", userName.value);
});

// Listen for "typing" events and display the typing indicator
socket.on("typing", (userId) => {
    if (userId) {
        document.getElementById(userId).innerText = "typing..";
    }
    setTimeout(() => {
        document.getElementById(userId).innerText = "";
    }, 1000);
});

// Handle the event when the user submits a new message
sendMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = { name: userName.value, message: message.value };

     // Emit the "newMessage" event to the server with the message data
    socket.emit("newMessage", data);

    // Add the message to the user's own message list
    const messageList = document.getElementById("message-list");
    const msg = document.createElement("div");
    const timestamp = new Date();

    msg.innerHTML = `
        <div class="message-block-user">
            <img src="images/1.jpg" alt="pic">
            <div class="message-content" style="background-color: #E91E63; color:white;">
                <p class="name" style="color:white; font-weight: bold; margin-bottom: 15px;">${userName.value
        }</p>
                <p class="message">${message.value}</p>
                <p class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</p>
            </div>
        </div>`;
    messageList.appendChild(msg);
   // Clear the input field after sending the message
    message.value = "";
});


// Listen for broadcast messages from the server and add them to the message list
socket.on("boradcastMessage", (newMessage) => {
    const messageList = document.getElementById("message-list");
    const msg = document.createElement("div");
    const timestamp = new Date(newMessage.time);
    // Differentiate the style for the user's own messages
    if (newMessage.name == userName.value) {
        msg.innerHTML = `
        <div class="message-block-user">
            <img src="images/1.jpg" alt="pic">
            <div class="message-content" style="background-color: #E91E63; color:white;">
                <p class="name" style="color:white; font-weight: bold; margin-bottom: 15px;">${newMessage.name
            }</p>
                <p class="message">${newMessage.message}</p>
                <p class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</p>
            </div>
        </div>`;
        messageList.appendChild(msg);
    } else {
        msg.innerHTML = `
        <div class="message-block">
            <img src="images/1.jpg" alt="pic">
            <div class="message-content">
                <p class="name">${newMessage.name}</p>
                <p class="message">${newMessage.message}</p>
                <p class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</p>
            </div>
        </div>`;
        messageList.appendChild(msg); // Add the message to the list
    }
    scrollToBottom();
});

// Function to scroll to the bottom of the message list
function scrollToBottom() {
    const messageList = document.getElementById("message-list");
    // Scroll the message container to the bottom
    messageList.scrollTop = messageList.scrollHeight; // Automatically scroll to the latest message
}