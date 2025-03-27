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
    }, []);

    if (!feed || feed?.length === 0) return <h2 className="sm:text-3xl text-2xl font-bold text-center my-24 sm:my-28 px-3">No New Users Found!</h2>;

    return (
        <div className="px-5 pt-24 pb-10 flex items-center justify-center flex-1 overflow-hidden">
            <div className="grid place-items-center">
                {feed?.map((user) => (
                    <UserCard
                        key={user._id}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;
