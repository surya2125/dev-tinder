import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { getMessages } from "../controllers/message.js";

const messageRouter = Router();
messageRouter.get("/get/:userId", userAuth, getMessages);

export default messageRouter;
