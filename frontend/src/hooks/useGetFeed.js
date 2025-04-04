import React, { useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useGlobalStore } from "../store/useStore";

const useGetFeed = () => {
    const { addFeed } = useGlobalStore();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await axiosInstance.get("/user/feed");
                if (response.data.success) {
                    addFeed(response.data.data);
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.error(err.response.data.message);
                }
            }
        };
        fetchFeed();
    }, [addFeed]);
};

export default useGetFeed;
