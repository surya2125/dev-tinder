import { useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { addRequests } from "../store/slices/requestSlice";
import RequestCard from "../components/RequestCard";

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);

    const fetchAllConnectionRequests = async () => {
        try {
            const response = await axiosInstance.get("/user/requests/received");
            if (response.data.success) {
                dispatch(addRequests(response.data.data));
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response.data.message);
            }
        }
    };

    useEffect(() => {
        fetchAllConnectionRequests();
    }, []);

    if (!requests || requests?.length === 0)
        return <h2 className="sm:text-3xl text-2xl font-bold text-center my-24 sm:my-28 px-3">No Connection Requests Received!</h2>;

    return (
        <div className="text-center my-24 sm:my-28 max-w-3xl w-full mx-auto px-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Incoming Connection Requests ({requests?.length})</h2>
            <div className="space-y-6 mt-8">
                {requests?.map((request) => (
                    <RequestCard
                        key={request._id}
                        request={request}
                    />
                ))}
            </div>
        </div>
    );
};

export default Requests;
