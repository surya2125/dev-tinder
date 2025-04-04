import app from "./app.js";
import { PORT } from "./config/config.js";
import { connectMongoDB } from "./utils/mongodb.js";

// Connecting to mongodb
connectMongoDB()
    .then(() => {
        // Connecting to server
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
