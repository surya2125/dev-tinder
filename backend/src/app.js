const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { FRONTEND_URL } = require("./config/config");
const notfoundMiddleware = require("./middlewares/notfound");
const errorMiddleware = require("./middlewares/error");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const healthRouter = require("./routes/health");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: FRONTEND_URL
    })
);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to devtinder backend !!!"
    });
});
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/user", userRouter);
app.use("/api/health", healthRouter);

app.use(errorMiddleware);
app.use("*", notfoundMiddleware);

module.exports = app;
