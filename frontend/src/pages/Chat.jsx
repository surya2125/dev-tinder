import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { connectSocket } from "../utils/socket";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { chatSchema } from "../schemas/chatSchema";
import toast from "react-hot-toast";
import Loader from "../components/Common/Loader";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";

const Chat = () => {
    const { _id: fromUserId, name, photoUrl } = useSelector((store) => store.user);
    const { userId: toUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const messageContainerRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { isValid },
        reset
    } = useForm({
        resolver: yupResolver(chatSchema),
        mode: "onChange"
    });

    const fetchChatMessages = async () => {
        try {
            const response = await axiosInstance.get(`/chat/received/${toUserId}`);
            if (response.data.success) {
                const messagesData = response.data.data.map((message) => {
                    const { _id: fromUserId, name, photoUrl } = message?.senderId;
                    const { text, time } = message;
                    return { name, photoUrl, text, time, from: fromUserId };
                });
                setMessages(messagesData);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response.data.message);
            }
        }
    };

    useEffect(() => {
        const socketConnection = connectSocket();
        setSocket(socketConnection);

        fetchChatMessages();

        return () => {
            socketConnection.disconnect();
        };
    }, [toUserId]);

    useEffect(() => {
        if (!socket || !fromUserId) return;

        // Join the chat
        socket.emit("join-chat", { name, fromUserId, toUserId });

        // Show error if we try to text someone who is not a friend
        socket.on("error", (err) => {
            toast.error(err);
            setIsLoading(true);
            setTimeout(() => navigate("/feed", { replace: true }), 1000);
        });

        // Handle new messages
        socket.on("receive-message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receive-message");
            socket.off("error");
        };
    }, [socket, fromUserId, toUserId]);

    useEffect(() => {
        if (messageContainerRef.current && messages.length > 0) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default behavior (new line)
            handleSubmit(onSubmit)(); // Submit the form
        }
    };

    const onSubmit = ({ message }) => {
        if (!socket) return;
        const currentTime = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
        socket.emit("send-message", { name, photoUrl, fromUserId, toUserId, text: message, time: currentTime });

        reset();
    };

    if (isLoading) return <Loader />;

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen mt-10 px-3 py-6 sm:px-5">
            <div className="w-full max-w-3xl bg-base-100 h-[80vh] sm:h-[85vh] p-3 rounded-md flex flex-col justify-between shadow-lg">
                <div
                    ref={messageContainerRef}
                    className="flex-1 overflow-y-auto pt-4 pb-4 mb-3 px-3 space-y-3">
                    {messages?.map((message, index) => (
                        <div
                            key={index}
                            className={`chat ${message.from === fromUserId ? "chat-end" : "chat-start"}`}>
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="photo"
                                        src={message.photoUrl}
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-2 space-x-1 text-xs">
                                <span>{message.name}</span>
                                <time className="opacity-50">{message.time}</time>
                            </div>
                            <div className="chat-bubble">{message.text}</div>
                        </div>
                    ))}
                </div>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative h-[20%]">
                    <textarea
                        type="text"
                        placeholder="Write a message..."
                        {...register("message")}
                        onKeyDown={handleKeyDown}
                        className="textarea resize-none w-full h-full p-2 sm:p-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary"></textarea>
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="btn btn-primary absolute top-3 right-3 px-3">
                        <IoMdSend className="text-lg sm:text-xl" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
