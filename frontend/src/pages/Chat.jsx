import { useState } from "react";
import { useParams } from "react-router";
import { IoMdSend } from "react-icons/io";

const Chat = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([
        {
            _id: "123",
            name: "Raju Rastogi",
            photoUrl: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
            text: "Hey there buddy!"
        }
    ]);

    return (
        <div className="flex-1 flex items-center justify-center h-full mt-20 mb-3 px-3">
            <div className="max-w-2xl w-full mx-auto bg-base-100 p-3 h-[80vh] rounded-md flex flex-col justify-between">
                <div className="h-[70%] overflow-y-scroll pt-4 pb-6 px-3 mb-3">
                    {messages?.map((message) => (
                        <div
                            key={message._id}
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
                                <time className="text-xs opacity-50">12:45</time>
                            </div>
                            <div className="chat-bubble text-sm">You were the Chosen One!</div>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <textarea
                        type="text"
                        placeholder="Write a message..."
                        className="textarea resize-none w-full h-32"></textarea>
                    <button className="btn btn-primary absolute top-3 right-3 px-3">
                        <IoMdSend className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
