import app from "./app.js";
import { FRONTEND_URL, PORT } from "./config/config.js";
import { connectMongoDB } from "./utils/mongodb.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

export const getReceiverSocketId = (receiverId) => {
    return usersConnectedToSocket[receiverId];
};

// Socket connection
const usersConnectedToSocket = {};

export const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT"]
    }
});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const loggedInUserId = socket.handshake.query.userId;
    usersConnectedToSocket[loggedInUserId] = socket.id;

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        delete usersConnectedToSocket[loggedInUserId];
    });
});

// Connecting to mongodb
connectMongoDB()
    .then(() => {
        // Connecting to server
        server.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
