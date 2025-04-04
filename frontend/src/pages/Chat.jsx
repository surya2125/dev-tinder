import { useParams } from "react-router";
import { IoMdSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { chatSchema } from "../schemas/chatSchema";
import useGetMessages from "../hooks/useGetMessages";
import { useGlobalStore } from "../store/useStore";
import Message from "../components/Chat/Message";
import useSendMessage from "../hooks/useSendMessage";

const Chat = () => {
    const { userId } = useParams();
    useGetMessages(userId);
    const { messages } = useGlobalStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid }
    } = useForm({
        resolver: yupResolver(chatSchema),
        mode: "onChange"
    });

    const { isLoading, handleSendMessage } = useSendMessage(reset, userId);

    const onSubmit = async ({ message }) => {
        await handleSendMessage(message);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen mt-10 px-3 py-6 sm:px-5">
            <div className="w-full max-w-3xl bg-base-100 h-[80vh] sm:h-[85vh] p-3 rounded-md flex flex-col justify-between shadow-lg">
                <div className="flex-1 overflow-y-auto pt-4 pb-4 mb-3 px-3 space-y-3">
                    {messages?.map((message) => (
                        <Message
                            key={message._id}
                            message={message}
                        />
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
