import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import JobsListing from "../components/JobsListing";
import Navbar from "../components/Navbar";

const Home = ({ setShowRecruiterLogin, setShowUserLogin }) => {
  return (
    <div>
      <Navbar
        setShowRecruiterLogin={setShowRecruiterLogin}
        setShowUserLogin={setShowUserLogin}
      />
      <Hero />
      <JobsListing />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
