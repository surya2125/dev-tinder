import TinderCard from "react-tinder-card";
import { truncateString } from "../../utils/truncateString";
import useSendRequest from "../../hooks/useSendRequest";

const UserCard = ({ user }) => {
    const { _id, name, about, age, gender, photoUrl } = user;
    const { handleSwipe, handleSendRequest } = useSendRequest(_id);

    return (
        <TinderCard
            onSwipe={handleSwipe}
            className="user-card h-full w-full max-w-md mx-auto sm:w-96 overflow-hidden border border-gray-200 rounded-lg cursor-grab active:cursor-grab"
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
                        <h2 className="text-lg sm:text-xl font-semibold">{name}</h2>
                        <p className="text-sm sm:text-base text-gray-600 sm:mt-1 mb-2">{age + ", " + gender}</p>
                        <p className="text-gray-300 text-sm sm:text-base">{truncateString(about, 50) || "No description available"}</p>
                    </div>
                    <div className="card-actions hidden sm:flex justify-between space-x-2 mt-4">
                        <button
                            onClick={() => handleSendRequest("ignored")}
                            className="btn btn-error btn-sm sm:btn-md flex-1 relative z-[1]">
                            Ignore
                        </button>
                        <button
                            onClick={() => handleSendRequest("interested")}
                            className="btn btn-primary btn-sm sm:btn-md flex-1 relative z-[1]">
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </TinderCard>
    );
};

export default UserCard;
