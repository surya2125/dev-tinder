import { useEffect } from "react";
import { useGlobalStore } from "../store/useStore";
import { useSocketContext } from "../context/SocketContext";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
    const { updateMessages } = useGlobalStore();
    const { socket } = useSocketContext();

    useEffect(() => {
            socket?.on("newMessage", (newMessage) => {
                const sound = new Audio(notificationSound);
                sound.play();
                updateMessages(newMessage);
            });
            return () => socket?.off("newMessage");
        }, [socket, updateMessages]);
};

export default useListenMessages;
