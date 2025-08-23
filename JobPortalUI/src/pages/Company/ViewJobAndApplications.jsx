import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetAllJobsQuery } from "../../features/api/companyApi";
import Loading from "../../components/Loading";
import SearchReusable from "./SearchReusable";
import filterJobs from "../../utils/filterFunction";
import Pagination from "../../components/Pagination";

const ViewJobAndApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [noJobsMsg, setNoJobdMsg] = useState("");

  const { isLoading, isSuccess, error, data } = useGetAllJobsQuery({
    pageNumber: currentPage,
  });

  const totalPages = Math.ceil(filteredJobs?.length / 10);

  const handleFilter = (filters) => {
    const filteredJobs = filterJobs(jobs, filters);
    setFilteredJobs(filteredJobs);
  };

  const handleReset = () => {
    const allJobs = filterJobs(jobs, {}); // no filters applied
    setFilteredJobs(allJobs);
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess && data) {
      if (data.message) {
        setNoJobdMsg(data.message);
      } else {
        setJobs(data.items);
        setFilteredJobs(data.items);
      }
    }
  }, [error, isSuccess, data]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-4 min-h-[90vh] flex flex-col">
      <SearchReusable onFilter={handleFilter} onReset={handleReset} />

      <div className="overflow-x-auto">
        {noJobsMsg && (
          <h3 className="text-center text-2xl font-bold">{noJobsMsg}</h3>
        )}

        {filteredJobs?.length > 0 ? (
          <table className="w-full max-w-7xl bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Job Title</th>
                <th className="py-2 px-4 text-left">Location</th>
                <th className="py-2 px-4 text-left">jobType</th>
                <th className="py-2 px-4 text-left max-sm:hidden">PostedOn</th>
                <th className="py-2 px-4 text-center max-sm:hidden">
                  Job Status
                </th>
                <th className="py-2 px-4 text-center">
                  View Job & Applications
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4">{job.jobTitle}</td>
                  <td className="py-3 px-4 max-sm:hidden">{job.jobLocation}</td>
                  <td className="py-3 px-4 max-sm:hidden">{job.jobType}</td>
                  <td className="py-3 px-4 max-sm:hidden">
                    {moment(job.postedOn).format("ll")}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={
                        job.jobStatus === "Open"
                          ? "bg-red-50 border border-red-200 px-3 py-1 rounded"
                          : "bg-red-200 border border-red-600 px-3 py-1 rounded"
                      }
                    >
                      {job.jobStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="px-2 py-1 border-1 bg-blue-100 border-gray-400 rounded-sm outline-none">
                      <Link
                        to={`/dashboard/jobInfoAndUsersApplications/${job.id}`}
                      >
                        👁️ View
                      </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="text-2xl font-semibold">No Jobs Found.</h2>
        )}
      </div>

      {/* Pagination */}
      {filteredJobs?.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ViewJobAndApplications;
