import { truncateString } from "../utils/truncateString";

const ConnectionCard = ({ connection }) => {
    const { photoUrl, name, about } = connection;
    return (
        <div className="flex items-center gap-5 bg-base-100 p-5 rounded-lg">
            <img
                src={photoUrl}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full"
                alt="photo"
                loading="lazy"
            />
            <div className="text-left space-y-1">
                <h3 className="font-semibold text-sm md:text-base">{name}</h3>
                <p className="text-xs md:text-sm">{truncateString(about, 150)}</p>
            </div>
        </div>
    );
};

export default ConnectionCard;
