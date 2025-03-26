import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import { clearUser } from "../../store/slices/userSlice";
import { clearFeed } from "../../store/slices/feedSlice";
import { clearConnections } from "../../store/slices/connectionSlice";
import { clearRequests } from "../../store/slices/requestSlice";
import { FaCode } from "react-icons/fa";

const Header = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await axiosInstance.post("/auth/logout");
            if (response.data.success) {
                dispatch(clearUser());
                dispatch(clearFeed());
                dispatch(clearConnections());
                dispatch(clearRequests());
                navigate("/login", { replace: true });
                toast.success(response.data.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <header className="min-h-16 px-5 fixed top-0 left-0 right-0 w-full z-50 bg-color-1 shadow-md shadow-primary/30">
            <div className="navbar container mx-auto">
                <div className="flex-1">
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-bold text-xl">
                        <FaCode className="h-6 w-6" />
                        <span>DevTinder</span>
                    </Link>
                </div>
                {user ? (
                    <div className="flex items-center gap-4 text-sm">
                        <p className="sm:block hidden">
                            Welcome, <b>{user?.name}</b>
                        </p>

                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user.photoUrl}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-base dropdown-content bg-base-100 rounded-box z-1 w-40 shadow p-0 py-2">
                                <p className="font-bold px-3">My Account</p>
                                <div className="divider m-0 mt-1"></div>
                                <div className="space-y-1">
                                    <li>
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/requests">Requests</Link>
                                    </li>
                                    <li>
                                        <Link to="/connections">Connections</Link>
                                    </li>
                                    <li>
                                        <a onClick={handleLogout}>Logout</a>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <button className="btn btn-primary">
                        <Link to="/login">Log In</Link>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
