import { truncateString } from "../../utils/truncateString";

const ProfileCard = ({ user }) => {
    const { name, about, age, gender, photoUrl } = user;

    return (
        <div
            draggable="false"
            className="card bg-white w-96 h-full select-none rounded-lg overflow-hidden border border-gray-200 pointer-events-none lg:block hidden">
            <img
                src={photoUrl}
                draggable="false"
                className="h-[70%] w-full rounded-t-lg touch-none select-none"
                alt="user"
            />
            <div className="p-4 bg-base-200 flex flex-col justify-between flex-1">
                <h2 className="card-title text-lg font-semibold">{name}</h2>
                {age && gender ? (
                    <p className="text-sm sm:text-base text-gray-600 mb-2">{age + ", " + gender}</p>
                ) : (
                    <p className="text-sm sm:text-base text-gray-400 mb-2">Age/Gender not available</p>
                )}
                <p className="text-gray-300 text-sm mt-3">{truncateString(about, 50) || "No description available"}</p>
                <div className="card-actions justify-between space-x-2 mt-4">
                    <button className="btn btn-error">Ignore</button>
                    <button className="btn btn-primary">Interested</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
