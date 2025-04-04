import { ChatModel } from "../models/chat.js";
import { MessageModel } from "../models/message.js";
import { ConnectionRequestModel } from "../models/connectionRequest.js";
import { UserModel } from "../models/user.js";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";

// Send message
const sendMessage = AsyncHandler(async (req, res, next) => {
    // Get data from request params and body
    const { userId: receiverId } = req.params;
    const { message } = req.body;

    // Get logged in user's id
    const senderId = req.user._id;

    // Check if the receiver exists in the db or not
    const receiverExists = await UserModel.findById(receiverId);
    if (!receiverExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Check if the sender and receiver are different or not
    if (String(senderId) === String(receiverId)) {
        throw new ErrorHandler("You cannot send message to yourself", 409);
    }

    // Check if the connection between sender and receiver exists in the db or not
    const connectionRequestExists = await ConnectionRequestModel.findOne({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    });
    if (!connectionRequestExists) {
        throw new ErrorHandler("You are not connected to the user", 401);
    }

    // Check if the chat exists in the db or not
    let chatExists = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    // If chat doesn't exists then create new one
    if (!chatExists) {
        chatExists = new ChatModel({
            participants: [senderId, receiverId]
        });
    }

    // Create a new message and save it along with existing chat
    const newMessage = new MessageModel({
        senderId,
        receiverId,
        message
    });
    if (newMessage) {
        chatExists.messages.push(newMessage._id);
    }
    await Promise.all([chatExists.save(), newMessage.save()]);

    // Structure the message data
    const newMessageData = await newMessage.populate([
        { path: "senderId", select: "name photoUrl" },
        { path: "receiverId", select: "name photoUrl" }
    ]);

    // Return the response
    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessageData
    });
});

// Get messages
const getMessages = AsyncHandler(async (req, res, next) => {
    // Get data from request params
    const { userId: receiverId } = req.params;

    // Get logged in user's id
    const senderId = req.user._id;

    // Check if the receiver exists in the db or not
    const receiverExists = await UserModel.findById(receiverId);
    if (!receiverExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Check if the chat exists in the db or not
    const chatExists = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate({
        path: "messages",
        populate: [
            { path: "senderId", select: "name photoUrl" },
            { path: "receiverId", select: "name photoUrl" }
        ]
    });
    if (!chatExists) {
        return res.status(200).json({
            success: true,
            message: "Fetched all messages successfully",
            data: []
        });
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched all messages successfully",
        data: chatExists.messages
    });
});

export { sendMessage, getMessages };
