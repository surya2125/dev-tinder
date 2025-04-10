import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config.js";

export const connectMongoDB = async () => {
    await mongoose.connect("mongodb+srv://Node:Node%40123@node.wk99q.mongodb.net/devTinder");
};

