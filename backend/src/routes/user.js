const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const { connectionRequestsReceived, allConnections, feed } = require("../controllers/user");

const userRouter = Router();
userRouter.get("/requests/received", userAuth, connectionRequestsReceived);
userRouter.get("/connections", userAuth, allConnections);
userRouter.get("/feed", userAuth, feed);

module.exports = userRouter;
