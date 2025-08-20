import { assets } from "../assets/assets";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQueryAndJobLocation } from "../features/slice/jobSearchSlice";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto 2xl:px-20 my-10">
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Start Your Search. Shape Your Future.
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Your next career move starts right here - Explore the best job
          opportunities and build a future you’re proud of!!
        </p>

        <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
          <div className="flex items-center">
            <img
              src={assets.search_icon}
              className="h-4 sm:h-5"
              alt="search_icon"
            />
            <input
              type="text"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              placeholder="Search for jobs.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <img
              src={assets.location_icon}
              className="h-4 sm:h-5"
              alt="location_icon"
            />
            <input
              type="text"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              placeholder="Location.."
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 px-6 py-2 rounded text-white m-1"
            onClick={() =>
              dispatch(
                setSearchQueryAndJobLocation({ searchQuery, jobLocation })
              )
            }
          >
            Search
          </button>
        </div>
      </div>

      {/* Companies div */}
      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex">
        <div className="flex justify-center gap-10 flex-wrap lg:gap-16">
          <p className="font-medium">Trusted by</p>
          <img
            src={assets.microsoft_logo}
            className="h-6"
            alt="microsoft_logo"
          />
          <img src={assets.walmart_logo} className="h-6" alt="walmart_logo" />
          <img
            src={assets.accenture_logo}
            className="h-6"
            alt="accenture_logo"
          />
          <img src={assets.google_logo} className="h-6" alt="google_logo" />
          <img src={assets.samsung_logo} className="h-6" alt="samsung_logo" />
          <img src={assets.amazon_logo} className="h-6" alt="amazon_logo" />
          <img src={assets.adobe_logo} className="h-6" alt="adobe_logo" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
