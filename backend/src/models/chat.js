const mongoose = require("mongoose");
const messageSchema = require("./message");

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: [true, "Please provide the participants"]
            }
        ],
        messages: [messageSchema]
    },
    { versionKey: false }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
