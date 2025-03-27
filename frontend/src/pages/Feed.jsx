import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { addFeed } from "../store/slices/feedSlice";
import UserCard from "../components/UserCard";

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector((store) => store.feed);

    const getFeed = async () => {
        try {
            const response = await axiosInstance.get("/user/feed");
            if (response.data.success) {
                dispatch(addFeed(response.data.data));
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response.data.message);
            }
        }
    };

    useEffect(() => {
        getFeed();
    }, [dispatch]);

    return (
        <div className="flex-1 pt-24 px-5 pb-10 flex flex-col items-center justify-center overflow-hidden">
            {feed?.length === 0 ? (
                <div className="text-center">
                    <h2 className="sm:text-3xl text-2xl font-bold">No New Users Found!</h2>
                    <img
                        src="/assets/not-found.svg"
                        alt="user-not-found"
                        className="block mx-auto w-96"
                    />
                </div>
            ) : (
                <div className="grid place-items-center">
                    {feed?.map((user, index) => (
                        <UserCard
                            key={index}
                            user={user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feed;
