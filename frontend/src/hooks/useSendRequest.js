import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useGlobalStore } from "../store/useStore";

const useSendRequest = (userId) => {
    const { updateFeed } = useGlobalStore();

    const handleSwipe = (direction) => {
        handleSendRequest(direction === "left" ? "ignored" : "interested", userId);
    };

    const handleSendRequest = async (status) => {
        try {
            const response = await axiosInstance.post(`/request/send/${status}/${userId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                updateFeed(userId);
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        }
    };

    return { handleSwipe, handleSendRequest };
};

export default useSendRequest;
