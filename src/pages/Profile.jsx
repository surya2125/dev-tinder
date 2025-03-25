import { useSelector } from "react-redux";
import EditProfile from "../components/Profile/EditProfile";
import ProfileCard from "../components/Profile/ProfileCard";
import Loader from "../components/Common/Loader";

const Profile = () => {
    const user = useSelector((store) => store.user);
    if (!user) return <Loader />;

    return (
        <div className="flex justify-center gap-10 items-center relative my-24">
            <EditProfile user={user} />
            <ProfileCard user={user} />
        </div>
    );
};

export default Profile;
