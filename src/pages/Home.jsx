import AboutSection from "../components/Home/AboutSection";
import HeroSection from "../components/Home/HeroSection";

const Home = () => {
    return (
        <div className="container mx-auto my-12 flex-1">
            <HeroSection />
            <AboutSection />
        </div>
    );
};

export default Home;
