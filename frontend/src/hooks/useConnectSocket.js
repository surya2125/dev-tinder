import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useGlobalStore } from "../store/useStore";
import notificationSound from "../assets/sounds/notification.mp3";

const useConnectSocket = (userId) => {
    const { user, updateMessages } = useGlobalStore();
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            withCredentials: true
        });
        setSocket(socket);

        socket.emit("joinChat", { name: user?.name, senderId: user?._id, receiverId: userId });

        socket.on("error", (err) => {
            toast.error(err);
            setIsLoading(true);
            setTimeout(() => navigate("/feed", { replace: true }), 1000);
        });

        socket.on("messageReceived", (newMessage) => {
            const sound = new Audio(notificationSound);
            sound.play();
            updateMessages(newMessage);
        });

        return () => {
            socket.close();
            setSocket(null);
        };
    }, [navigate, updateMessages, user?._id, user?.name, userId]);

    return { socket, isLoading };
};

export default useConnectSocket;
