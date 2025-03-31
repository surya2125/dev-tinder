const ChatModel = require("../models/chat");
const { AsyncHandler } = require("../utils/handlers");

// Get chat messages
const getChatMessages = AsyncHandler(async (req, res, next) => {
    // Get data from request params
    const { userId: toUserId } = req.params;

    // Get logged in user's id
    const fromUserId = req.user._id;

    // Check if the chat already exists in the db or not
    let chatExists = await ChatModel.findOne({
        participants: { $all: [fromUserId, toUserId] }
    }).populate({
        path: "messages.senderId",
        select: "name photoUrl"
    });
    if (!chatExists) {
        chatExists = new ChatModel({
            participants: [fromUserId, toUserId],
            messages: []
        });
        await chatExists.save();
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched chat successfully",
        data: chatExists.messages
    });
});

module.exports = { getChatMessages };
