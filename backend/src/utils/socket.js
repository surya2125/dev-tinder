const { Server } = require("socket.io");
const { FRONTEND_URL } = require("../config/config");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            credentials: true,
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            origin: FRONTEND_URL
        }
    });
    io.on("connection", (socket) => {
        // Socket events
        socket.on("joinChat", () => {});

        socket.on("sendMessage", () => {});

        socket.on("disconnect", () => {});
    });
};

module.exports = initializeSocket;
