const { Server } = require("socket.io");
const { FRONTEND_URL } = require("../config/config");
const ConnectionRequestModel = require("../models/connectionRequest");
const crypto = require("crypto");
const { ErrorHandler } = require("./handlers");
const ChatModel = require("../models/chat");

const getRoomId = (fromUserId, toUserId) => {
    return crypto.createHash("sha256").update([fromUserId, toUserId].sort().join("_")).digest("hex").slice(0, 10);
};

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
        socket.on("join-chat", async (data) => {
            try {
                // Get data from client
                const { name, fromUserId, toUserId } = data;

                // Check if the connection request exists in the db or not
                const connectionRequestExists = await ConnectionRequestModel.findOne({
                    $or: [
                        { fromUserId, toUserId },
                        { fromUserId: toUserId, toUserId: fromUserId }
                    ]
                });
                if (!connectionRequestExists) {
                    socket.emit("error", "Not allowed to chat with the user");
                    return;
                }

                // Create a room and join the room
                const roomId = getRoomId(fromUserId, toUserId);
                socket.join(roomId);
                console.log(`${name} joined the room: ${roomId}`);
            } catch (err) {
                throw new ErrorHandler(err.message, 400);
            }
        });

        socket.on("send-message", async (data) => {
            try {
                // Get data from client
                const { name, photoUrl, fromUserId, toUserId, text, time } = data;

                // Check if the chat exists in the db or not
                let chatExists = await ChatModel.findOne({
                    participants: { $all: [fromUserId, toUserId] }
                });
                if (!chatExists) {
                    chatExists = new ChatModel({
                        participants: [fromUserId, toUserId],
                        messages: []
                    });
                }
                chatExists.messages.push({
                    senderId: fromUserId,
                    text,
                    time
                });
                await chatExists.save();

                // Create a room
                const roomId = getRoomId(fromUserId, toUserId);

                // Send the message to the particular room
                io.to(roomId).emit("receive-message", { name, photoUrl, text, time, from: fromUserId });
            } catch (err) {
                throw new ErrorHandler(err.message, 400);
            }
        });
    });
};

module.exports = { connectSocket };
