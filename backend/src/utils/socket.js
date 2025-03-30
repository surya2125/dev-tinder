const { Server } = require("socket.io");
const { FRONTEND_URL } = require("../config/config");

const connectSocket = (server) => {
    // Create a new instance of socket io
    const io = new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            credentials: true
        }
    });

    // Create a connection to handle all the socket connections
    io.on("connection", (socket) => {
        console.log("Socket is connected successfully: ", socket.id);

        // Handle events
        socket.on("join", (data) => {
            const { name, fromUserId, toUserId } = data;
            const roomId = [fromUserId, toUserId].sort().join("_");
            console.log(`${name} joined the room: ${roomId}`);
            socket.join(roomId);
        });

        socket.on("send-message", (data) => {
            const { name, photoUrl, fromUserId, toUserId, text, time } = data;
            const roomId = [fromUserId, toUserId].sort().join("_");
            io.to(roomId).emit("messages", { name, photoUrl, text, time });
        });
    });
};

module.exports = { connectSocket };
