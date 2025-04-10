import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config.js";

export const connectMongoDB = async () => {
    await mongoose.connect(MONGODB_URL);
};

