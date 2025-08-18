import {
  assets,
  JobCategories,
  JobLocations,
  JobType,
  JobLevel,
  jobsData,
} from "../assets/assets";
import JobCard from "./JobCard";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import { useJobSearchQuery } from "../features/api/userApi";
import { setSearchQueryAndJobLocation } from "../features/slice/jobSearchSlice";
import { toast } from "react-toastify";

const JobsListing = () => {
  const { searchQuery, jobLocation } = useSelector((state) => state.jobSearch);

  // job search state variables
  const [searchResults, setSearchResults] = useState(null);
  const [jobCategory, setJobCategory] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobType, setJobType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  console.log(jobLevel, jobType);

  // filter section states
  const [showFilter, setShowFilter] = useState(false);
  const [section, setSection] = useState("category");
  const [open, setOpen] = useState(true);

  const dispatch = useDispatch();

  const { isLoading, isSuccess, error, data } = useJobSearchQuery({
    searchQuery,
    jobLocation,
    jobCategory,
    jobLevel,
    jobType,
    pageNumber: currentPage,
  });

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

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto 2xl:px-20 flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-6">
        {/* isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && */}
        {/* <div>
          <h3 className="font-medium text-lg mb-4">Current Search</h3>
          <div className="mb-4 text-gray-600">
            <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
              JobTitle <img src={assets.cross_icon} alt="cross_icon" />
            </span>
            <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
              JobLocation <img src={assets.cross_icon} alt="cross_icon" />
            </span>
          </div>
        </div> */}

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
              src={
                open && section === "category"
                  ? assets.up_arrow
                  : assets.down_arrow
              }
              alt="down_arrow"
              className={
                open && section === "category" ? "w-6 h-6 mr-3" : "w-10 mr-1"
              }
              onClick={() => {
                setOpen((prev) => !prev);
                setSection("category");
              }}
            />
          </div>
          {open && section === "category" && (
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
              src={
                open && section === "location"
                  ? assets.up_arrow
                  : assets.down_arrow
              }
              alt="down_arrow"
              className={
                open && section === "location" ? "w-6 h-6 mr-3" : "w-10 mr-1"
              }
              onClick={() => {
                setOpen((prev) => !prev);
                setSection("location");
              }}
            />
          </div>
          {open && section === "location" && (
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

        {/* Locations Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg py-4">Job Type</h4>
            <img
              src={
                open && section === "jobtype"
                  ? assets.up_arrow
                  : assets.down_arrow
              }
              alt="down_arrow"
              className={
                open && section === "jobtype" ? "w-6 h-6 mr-3" : "w-10 mr-1"
              }
              onClick={() => {
                setOpen((prev) => !prev);
                setSection("jobtype");
              }}
            />
          </div>
          {open && section === "jobtype" && (
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

        {/* Locations Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-lg py-4">Job Level</h4>
            <img
              src={
                open && section === "joblevel"
                  ? assets.up_arrow
                  : assets.down_arrow
              }
              alt="down_arrow"
              className={
                open && section === "joblevel" ? "w-6 h-6 mr-3" : "w-10 mr-1"
              }
              onClick={() => {
                setOpen((prev) => !prev);
                setSection("joblevel");
              }}
            />
          </div>
          {open && section === "joblevel" && (
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
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-6">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Apply now to get hired by the top companies</p>

        {/* Job Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {searchResults?.latestJobs ? (
            searchResults?.latestJobs?.map((job, index) => (
              <JobCard key={index} job={job} />
            ))
          ) : searchResults?.jobs === 0 ? (
            <h2 className="text-2xl font-semibold">{searchResults?.message}</h2>
          ) : (
            searchResults?.jobs?.map((job, index) => (
              <JobCard key={index} job={job} />
            ))
          )}
        </div>

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
