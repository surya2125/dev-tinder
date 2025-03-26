const app = require("./app");
const { PORT } = require("./config/config");
const connectMongoDB = require("./utils/mongodb");

// Connection to database
connectMongoDB()
    .then(() => {
        // Connecting to server
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err.message);
    });
