const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide the sender id"]
        },
        text: {
            type: String,
            required: [true, "Please provide the message"],
            trim: true
        },
        time: {
            type: String,
            required: [true, "Please provide the time"],
            trim: true
        }
    },
    { versionKey: false }
);

module.exports = messageSchema;
