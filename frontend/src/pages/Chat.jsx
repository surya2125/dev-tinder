import { useEffect, useMemo, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { connectSocket } from "../utils/socket";

const Chat = () => {
    const { _id: fromUserId, name, photoUrl } = useSelector((store) => store.user);
    const { userId: toUserId } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketConnection = connectSocket();
        setSocket(socketConnection);

        // Join the chat
        socketConnection.emit("join", { name, fromUserId, toUserId });

        // Receive all messages
        socketConnection.on("messages", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [name, fromUserId, toUserId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !socket) return;

        const currentTime = new Date().toLocaleTimeString("fr", {
            hour: "2-digit",
            minute: "2-digit"
        });

        socket.emit("send-message", { name, photoUrl, fromUserId, toUserId, text: message.trim(), time: currentTime });
        setMessage("");
    };

    return (
        <div className="flex-1 flex items-center justify-center h-full mt-20 mb-3 px-3">
            <div className="max-w-2xl w-full mx-auto bg-base-100 h-[80vh] py-3 px-3 rounded-md flex flex-col justify-between">
                <div className="h-[70%] overflow-y-scroll pt-4 pb-2 px-3 mb-2 space-y-3">
                    {messages?.map((message, index) => (
                        <div
                            key={index}
                            className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src={message.photoUrl}
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                {message.name}
                                <time className="text-xs opacity-50">{message.time}</time>
                            </div>
                            <div className="chat-bubble text-sm">{message.text}</div>
                        </div>
                    ))}
                </div>
                <form
                    onSubmit={handleSendMessage}
                    className="relative h-[30%]">
                    <textarea
                        type="text"
                        placeholder="Write a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="textarea resize-none w-full h-full"></textarea>
                    <button
                        type="submit"
                        className="btn btn-primary absolute top-3 right-3 px-3">
                        <IoMdSend className="text-lg" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
