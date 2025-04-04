import { useParams } from "react-router";
import { IoMdSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { chatSchema } from "../schemas/chatSchema";
import useGetMessages from "../hooks/useGetMessages";
import { useGlobalStore } from "../store/useStore";
import Message from "../components/Chat/Message";
import useSendMessage from "../hooks/useSendMessage";
import { useEffect, useRef } from "react";
import useListenMessages from "../hooks/useListenMessages";

const Chat = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid }
    } = useForm({
        resolver: yupResolver(chatSchema),
        mode: "onChange"
    });

    const { userId } = useParams();
    const { messages } = useGlobalStore();
    useGetMessages(userId);
    useListenMessages();

    const lastMessageRef = useRef();
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const { isLoading, handleSendMessage } = useSendMessage(reset, userId);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default behavior (new line)
            handleSubmit(onSubmit)(); // Submit the form
        }
    };

    const onSubmit = async ({ message }) => {
        await handleSendMessage(message);
    };

    return (
        <div className="mt-10 flex-1  flex items-center justify-center">
            <div className="bg-base-100 p-3 rounded-md shadow-lg max-w-xl w-full">
                <div className="pt-4 pb-4 mb-3 px-3 space-y-3 h-[50vh] overflow-y-auto">
                    {messages?.map((message) => (
                        <div
                            key={message._id}
                            ref={lastMessageRef}>
                            <Message message={message} />
                        </div>
                    ))}
                </div>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative h-[20vh]">
                    <textarea
                        type="text"
                        placeholder="Write a message..."
                        {...register("message")}
                        onKeyDown={handleKeyDown}
                        className="textarea resize-none w-full h-full p-2 sm:p-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary"></textarea>
                    <button
                        disabled={!isValid || isLoading}
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
