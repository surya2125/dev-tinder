import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import useGetUser from "../../hooks/useGetUser";
import Loader from "./Loader";

const Body = () => {
    const { isLoading } = useGetUser();

    if (isLoading) return <Loader />;

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <Toaster />
        </>
    );
};

export default Body;
