const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const { getChatMessages } = require("../controllers/chat");

const chatRouter = Router();
chatRouter.get("/received/:userId", userAuth, getChatMessages);

module.exports = chatRouter;
