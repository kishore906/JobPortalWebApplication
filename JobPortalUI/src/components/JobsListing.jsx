import {
  assets,
  JobCategories,
  JobLocations,
  JobType,
  JobLevel,
} from "../assets/assets";
import JobCard from "./JobCard";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import { useJobSearchQuery } from "../features/api/userApi";
import { setSearchQueryAndJobLocation } from "../features/slice/jobSearchSlice";
//import { toast } from "react-toastify";

const JobsListing = () => {
  const { searchQuery, jobLocation } = useSelector((state) => state.jobSearch);

  // job search state variables
  const [jobCategory, setJobCategory] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // filter section states
  const [showFilter, setShowFilter] = useState(false);
  const [section, setSection] = useState("category");

  const dispatch = useDispatch();

  const {
    isLoading,
    error,
    data: searchResults,
  } = useJobSearchQuery({
    searchQuery,
    jobLocation,
    jobCategory,
    jobLevel,
    jobType,
    pageNumber: currentPage,
  });

  /*
  useEffect(() => {
    if (error) {
      console.log(error);
      //toast.error(error.data.message);
    }

    if (isSuccess && data) {
      console.log(data);
      setSearchResults(data);
    }
  }, [error, isSuccess, data]);
  */

  return (
    <div className="container mx-auto 2xl:px-20 flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar */}
      <div className="w-full lg:w-1/5 bg-white px-3">
        <button
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Categories Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg py-4">Category</h4>
            <img
              src={section === "category" ? assets.up_arrow : assets.down_arrow}
              alt="down_arrow"
              className={section === "category" ? "w-6 h-6 mr-3" : "w-10 mr-1"}
              onClick={() => {
                setSection(section === "category" ? null : "category");
              }}
            />
          </div>
          {section === "category" && (
            <ul className="space-y-4 text-gray-600">
              {JobCategories.map((category, index) => {
                return (
                  <li key={index} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="scale-125"
                      name="category"
                      value={category}
                      checked={jobCategory === category}
                      onChange={() =>
                        setJobCategory(
                          (prev) => (prev === category ? "" : category) // unselect if clicked again
                        )
                      }
                    />
                    {category}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr className="mt-3 text-gray-300" />

        {/* Locations Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg py-4">Location</h4>
            <img
              src={section === "location" ? assets.up_arrow : assets.down_arrow}
              alt="down_arrow"
              className={section === "location" ? "w-6 h-6 mr-3" : "w-10 mr-1"}
              onClick={() => {
                setSection(section === "location" ? null : "location");
              }}
            />
          </div>
          {section === "location" && (
            <ul className="space-y-4 text-gray-600">
              {JobLocations.map((location, index) => {
                return (
                  <li key={index} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="scale-125"
                      name="location"
                      value={location}
                      checked={jobLocation === location}
                      onChange={() =>
                        dispatch(
                          setSearchQueryAndJobLocation({
                            searchQuery,
                            jobLocation:
                              jobLocation === location ? "" : location,
                          })
                        )
                      }
                    />
                    {location}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr className="mt-3 text-gray-300" />

        {/* JobType Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg py-4">Job Type</h4>
            <img
              src={section === "jobtype" ? assets.up_arrow : assets.down_arrow}
              alt="down_arrow"
              className={section === "jobtype" ? "w-6 h-6 mr-3" : "w-10 mr-1"}
              onClick={() => {
                setSection(section === "jobtype" ? null : "jobtype");
              }}
            />
          </div>
          {section === "jobtype" && (
            <ul className="space-y-4 text-gray-600">
              {JobType.map((type, index) => {
                return (
                  <li key={index} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="scale-125"
                      name="type"
                      value={type}
                      checked={jobType === type}
                      onChange={() =>
                        setJobType((prev) => (prev === type ? "" : type))
                      }
                    />
                    {type}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr className="mt-3 text-gray-300" />

        {/* JobLevel Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg py-4">Job Level</h4>
            <img
              src={section === "joblevel" ? assets.up_arrow : assets.down_arrow}
              alt="down_arrow"
              className={section === "joblevel" ? "w-6 h-6 mr-3" : "w-10 mr-1"}
              onClick={() => {
                setSection(section === "joblevel" ? null : "joblevel");
              }}
            />
          </div>
          {section === "joblevel" && (
            <ul className="space-y-4 text-gray-600">
              {JobLevel.map((level, index) => {
                return (
                  <li key={index} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="scale-125"
                      name="level"
                      value={level}
                      checked={jobLevel === level}
                      onChange={() =>
                        setJobLevel((prev) => (prev === level ? "" : level))
                      }
                    />
                    {level}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr className="mt-3 text-gray-300" />
      </div>

      {/* Jobs Display */}
      <section className="w-full lg:w-4/5 text-gray-800 max-lg:px-6">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Apply now to get hired by the top companies</p>

        {/* Job Card */}
        {isLoading ? (
          <Loading />
        ) : searchResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {searchResults?.latestJobs ? (
              searchResults?.latestJobs?.map((job, index) => (
                <JobCard key={index} job={job} />
              ))
            ) : searchResults?.jobs === 0 ? (
              <h2 className="text-2xl font-semibold">
                {searchResults?.message}
              </h2>
            ) : (
              searchResults?.jobs?.map((job, index) => (
                <JobCard key={index} job={job} />
              ))
            )}
          </div>
        ) : (
          <h3 className="text-xl font-semibold">{error?.data?.message}</h3>
        )}

        {/* Pagination */}
        {(searchResults?.latestJobs?.length > 0 ||
          searchResults?.jobs?.length > 0) && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <img
              src={assets.left_arrow_icon}
              alt="left_arrow_icon"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            />

            {Array.from({ length: searchResults?.totalPages }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            <img
              src={assets.right_arrow_icon}
              alt="right_arrow_icon"
              onClick={() =>
                setCurrentPage(
                  Math.min(currentPage + 1, searchResults?.totalPages)
                )
              }
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default JobsListing;
