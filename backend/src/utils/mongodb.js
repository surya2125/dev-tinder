const mongoose = require("mongoose");
const { MONGODB_URL } = require("../config/config");

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, { dbName: "devtinder" });
        console.log("MongoDB is connected successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;
