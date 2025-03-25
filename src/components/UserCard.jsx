import { truncateString } from "../utils/truncateString";
import TinderCard from "react-tinder-card";
import toast from "react-hot-toast";
import { updateFeed } from "../store/slices/feedSlice";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axiosInstance";

const UserCard = ({ user }) => {
    const { _id, name, about, age, gender, photoUrl } = user;
    const dispatch = useDispatch();

    const handleSendRequest = async (status, userId) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post(`/request/send/${status}/${userId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(updateFeed(userId));
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        } finally {
            toast.dismiss(toastId);
        }
    };

    const handleSwipe = async (dir, userId) => {
        let status;
        if (dir === "right") {
            status = "interested";
        } else if (dir === "left") {
            status = "ignored";
        }
        await handleSendRequest(status, userId);
    };

    return (
        <TinderCard
            key={_id}
            className="absolute shadow-none"
            onSwipe={(dir) => handleSwipe(dir, _id)}
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}>
            <div
                style={{ gridColumns: 1, gridRows: 1 }}
                className="card bg-white w-96 h-full select-none rounded-lg overflow-hidden border border-gray-200 pointer-events-none">
                <img
                    src={photoUrl}
                    draggable="false"
                    className="h-[70%] w-full rounded-t-lg touch-none select-none"
                    alt="user"
                    loading="lazy"
                />
                <div className="p-4 bg-base-200 flex flex-col justify-between flex-1">
                    <h2 className="card-title text-lg font-semibold">{name}</h2>
                    {age || gender ? (
                        <p className="text-sm text-gray-600">
                            {age ? `${age} years old` : ""}
                            {age && gender ? ", " : ""}
                            {gender || ""}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400 mb-2">Age/Gender not available</p>
                    )}
                    <p className="text-gray-300 text-sm mt-3">{truncateString(about, 50) || "No description available"}</p>
                    <div className="card-actions justify-between space-x-2 mt-4">
                        <button
                            onClick={() => handleSendRequest("ignored", _id)}
                            className="btn btn-error">
                            Ignore
                        </button>
                        <button
                            onClick={() => handleSendRequest("interested", _id)}
                            className="btn btn-primary">
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </TinderCard>
    );
};

export default UserCard;
