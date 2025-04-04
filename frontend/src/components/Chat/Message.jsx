import { useGlobalStore } from "../../store/useStore";

const Message = ({ message }) => {
    const { user } = useGlobalStore();

    const fromMe = user?._id === message?.senderId?._id;
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const photoUrl = fromMe ? user?.photoUrl : message?.senderId?.photoUrl;
    const formattedTime = new Date(message?.createdAt).toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={photoUrl}
                    />
                </div>
            </div>
            <div className={`chat-bubble text-white text-sm mb-1`}>{message?.message}</div>
            <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
        </div>
    );
};

export default Message;
