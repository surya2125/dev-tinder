import { io } from "socket.io-client";

export const connectSocket = () => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
    });

    return socket;
};
