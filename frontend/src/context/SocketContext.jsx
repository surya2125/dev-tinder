import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGlobalStore } from "../store/useStore";

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useGlobalStore();

    useEffect(() => {
        if (user) {
            const socket = io(import.meta.env.VITE_BACKEND_URL, {
                query: {
                    userId: user?._id
                }
            });
            setSocket(socket);

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
