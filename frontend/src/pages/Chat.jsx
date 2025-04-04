import { useParams } from "react-router";
import { IoMdSend } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { chatSchema } from "../schemas/chatSchema";
import { useGlobalStore } from "../store/useStore";
import useGetMessages from "../hooks/useGetMessages";
import useConnectSocket from "../hooks/useConnectSocket";
import Messages from "../components/Chat/Messages";
import Loader from "../components/Common/Loader";

const Chat = () => {
    const { user } = useGlobalStore();
    const { userId } = useParams();
    useGetMessages(userId);
    const { socket, isLoading } = useConnectSocket(userId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid }
    } = useForm({
        resolver: yupResolver(chatSchema),
        mode: "onChange"
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const onSubmit = ({ message }) => {
        socket?.emit("sendMessage", { senderId: user?._id, receiverId: userId, message });
        reset();
    };

    if (isLoading) return <Loader />;

    return (
        <div className="mt-20 mb-10 flex-1 flex items-center justify-center px-3">
            <div className="bg-base-100 p-2 pb-3 rounded-md shadow-lg max-w-xl w-full">
                <Messages />
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative h-32">
                    <textarea
                        type="text"
                        placeholder="Write a message..."
                        {...register("message")}
                        onKeyDown={handleKeyDown}
                        className="textarea resize-none w-full h-full p-2 sm:p-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary"></textarea>
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="btn btn-primary absolute top-3 right-3 text-lg h-8 p-2">
                        <IoMdSend />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
