import {
  assets,
  JobCategories,
  JobLocations,
  jobsData,
} from "../assets/assets";
import JobCard from "./JobCard";
import { useState } from "react";

const JobsListing = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="container mx-auto 2xl:px-20 flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-6">
        {/* isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && */}
        <>
          <h3 className="font-medium text-lg mb-4">Current Search</h3>
          <div className="mb-4 text-gray-600">
            <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
              JobTitle <img src={assets.cross_icon} alt="cross_icon" />
            </span>
            <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
              JobLocation <img src={assets.cross_icon} alt="cross_icon" />
            </span>
          </div>
        </>

        <button
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Categories Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Category</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => {
              return (
                <li key={index} className="flex gap-3 items-center">
                  <input type="checkbox" className="scale-125" name="" />
                  {category}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Locations Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => {
              return (
                <li key={index} className="flex gap-3 items-center">
                  <input type="checkbox" className="scale-125" name="" />
                  {location}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Jobs Display */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-6">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Apply now to get hired by the top companies</p>

        {/* Job Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobsData
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
        </div>

        {/* Pagination */}
        {jobsData.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="#job-list">
              <img
                src={assets.left_arrow_icon}
                alt="left_arrow_icon"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              />
            </a>
            {Array.from({ length: Math.ceil(jobsData.length / 6) }).map(
              (_, index) => (
                <a href="#job-list" key={index}>
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-100 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </a>
              )
            )}
            <a href="#job-list">
              <img
                src={assets.right_arrow_icon}
                alt="right_arrow_icon"
                onClick={() =>
                  setCurrentPage(
                    Math.min(currentPage + 1, Math.ceil(jobsData.length / 6))
                  )
                }
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobsListing;
