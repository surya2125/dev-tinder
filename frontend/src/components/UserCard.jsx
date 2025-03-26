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

    const handleSwipe = (dir, userId) => {
        const status = dir === "right" ? "interested" : "ignored";
        handleSendRequest(status, userId);
    };

    return (
        <TinderCard
            className="user-card h-full w-full max-w-md mx-auto sm:w-96 overflow-hidden border border-gray-200 rounded-lg cursor-grab active:cursor-grab"
            key={_id}
            onSwipe={(dir) => handleSwipe(dir, _id)}
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}>
            <div className="card h-full flex flex-col">
                <div className="aspect-square w-full relative">
                    <img
                        src={photoUrl}
                        draggable="false"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                        alt="user"
                    />
                </div>
                <div className="p-4 bg-base-200 flex flex-col justify-between flex-grow">
                    <div>
                        <h2 className="card-title text-lg sm:text-xl font-semibold mb-2">{name}</h2>
                        {age && gender ? (
                            <p className="text-sm sm:text-base text-gray-600 mb-2">{age + ", " + gender}</p>
                        ) : (
                            <p className="text-sm sm:text-base text-gray-400 mb-2">Age/Gender not available</p>
                        )}
                        <p className="text-gray-300 text-sm sm:text-base mt-3">{truncateString(about, 50) || "No description available"}</p>
                    </div>
                    <div className="card-actions flex justify-between space-x-2 mt-4">
                        <button
                            onClick={() => handleSendRequest("ignored", _id)}
                            className="btn btn-error btn-sm sm:btn-md flex-1">
                            Ignore
                        </button>
                        <button
                            onClick={() => handleSendRequest("interested", _id)}
                            className="btn btn-primary btn-sm sm:btn-md flex-1">
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </TinderCard>
    );
};

export default UserCard;
