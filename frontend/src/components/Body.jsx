import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "./Common/Header";
import Footer from "./Common/Footer";

const Body = () => {
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
