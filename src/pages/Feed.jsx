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

    if (!feed || feed?.length === 0) return <h2 className="text-center my-32 font-bold text-3xl">No New Users Found!</h2>;

    return (
        <div className="flex-1 relative overflow-hidden">
            <div className="w-96 mx-auto max-w-full my-32">
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
