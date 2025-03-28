const socket = require("socket.io");
const { FRONTEND_URL } = require("../config/config");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            credentials: true,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            origin: FRONTEND_URL
        }
    });
    io.on("connection", (socket) => {
        // Connected to socket
        console.log(`Socket is connected successfully: ${socket.id}`);

        // Socket events
        socket.on("joinChat", () => {});

        socket.on("sendMessage", () => {});

        socket.on("disconnect", () => {});
    });
};

module.exports = initializeSocket;
