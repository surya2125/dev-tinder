import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { getMessages, sendMessage } from "../controllers/message.js";

const messageRouter = Router();
messageRouter.post("/send/:userId", userAuth, sendMessage);
messageRouter.get("/get/:userId", userAuth, getMessages);

export default messageRouter;
