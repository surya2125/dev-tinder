import AboutSection from "../components/Home/AboutSection";
import HeroSection from "../components/Home/HeroSection";

const Home = () => {
    return (
        <div className="container mx-auto my-10 flex-1 px-5 flex flex-col items-center justify-center">
            <HeroSection />
            <AboutSection />
        </div>
    );
};

export default Home;
