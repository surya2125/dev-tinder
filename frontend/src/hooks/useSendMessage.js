import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useGlobalStore } from "../store/useStore";
import { useState } from "react";

const useSendMessage = (reset, userId) => {
    const [isLoading, setIsLoading] = useState(false);
    const { updateMessages } = useGlobalStore();

    const handleSendMessage = async (message) => {
        setIsLoading(true);
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post(`/message/send/${userId}`, { message });
            if (response.data.success) {
                updateMessages(response.data.data);
                toast.success(response.data.message);
                reset();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        } finally {
            setIsLoading(false);
            toast.dismiss(toastId);
        }
    };

    return { isLoading, handleSendMessage };
};

export default useSendMessage;
