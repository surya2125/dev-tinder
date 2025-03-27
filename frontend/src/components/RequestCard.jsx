import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { updateRequests } from "../store/slices/requestSlice";
import { truncateString } from "../utils/truncateString";

const RequestCard = ({ request }) => {
    const dispatch = useDispatch();

    const handleReviewRequest = async (status, requestId) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post(`/request/review/${status}/${requestId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(updateRequests(requestId));
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        } finally {
            toast.dismiss(toastId);
        }
    };

    const { _id: requestId } = request;
    const { photoUrl, name, about } = request.fromUserId;

    return (
        <div className="flex flex-wrap items-center gap-5 bg-base-100 p-5 rounded-lg md:flex-nowrap">
            <div className="flex items-center gap-5 flex-1">
                <img
                    src={photoUrl}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full"
                    alt="photo"
                    loading="lazy"
                />
                <div className="text-left space-y-1">
                    <h3 className="font-semibold text-sm md:text-base">{name}</h3>
                    <p className="text-xs md:text-sm">{truncateString(about, 60)}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
                <button
                    onClick={() => handleReviewRequest("rejected", requestId)}
                    className="btn btn-error btn-sm sm:btn-md">
                    Reject
                </button>
                <button
                    onClick={() => handleReviewRequest("accepted", requestId)}
                    className="btn btn-primary btn-sm sm:btn-md">
                    Accept
                </button>
            </div>
        </div>
    );
};

export default RequestCard;
