const app = require("./app");
const { PORT } = require("./config/config");
const connectMongoDB = require("./utils/mongodb");
const http = require("http");
const initializeSocket = require("./utils/socket");

const server = http.createServer(app);
initializeSocket(server);

// Connection to database
connectMongoDB()
    .then(() => {
        // Connecting to server
        server.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err.message);
    });
