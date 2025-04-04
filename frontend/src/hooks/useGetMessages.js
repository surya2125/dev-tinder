import { useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useGetMessages = (receiverId) => {
    const { addMessages } = useGlobalStore();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`/message/get/${receiverId}`);
                if (response.data.success) {
                    addMessages(response.data.data);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.error(err.response.data.message);
                }
            }
        };
        fetchMessages();
    }, [addMessages, receiverId]);
};

export default useGetMessages;
