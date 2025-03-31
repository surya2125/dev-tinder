const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { FRONTEND_URL } = require("./config/config");
const notfoundMiddleware = require("./middlewares/notfound");
const errorMiddleware = require("./middlewares/error");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const healthRouter = require("./routes/health");
const chatRouter = require("./routes/chat");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: FRONTEND_URL,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true
    })
);
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/health", healthRouter);

app.use(errorMiddleware);
app.use("*", notfoundMiddleware);

module.exports = app;
