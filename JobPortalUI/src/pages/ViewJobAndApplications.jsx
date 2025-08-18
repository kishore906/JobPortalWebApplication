import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetAllJobsQuery } from "../features/api/companyApi";
import Loading from "../components/Loading";

const ViewJobAndApplications = () => {
  const { isLoading, isSuccess, error, data } = useGetAllJobsQuery();
  const [jobs, setJobs] = useState([]);
  const [noJobsMsg, setNoJobdMsg] = useState("");

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess && data) {
      if (data.message) {
        setNoJobdMsg(data.message);
      } else {
        setJobs(data);
      }
    }
  }, [error, isSuccess, data]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-3 mb-4">
        <select className="w-full max-w-sm px-3 py-2 border-1 border-gray-300 rounded-full outline-none">
          <option value="" disabled selected>
            Select Job:
          </option>
          <option>job 1</option>
          <option>job 2</option>
        </select>
        <select className="w-full max-w-xs px-3 py-2 border-1 border-gray-300 rounded-full outline-none">
          <option value="" disabled selected>
            Select Location:
          </option>
          <option>location 1</option>
          <option>location 2</option>
        </select>
      </div>

      {noJobsMsg && (
        <h3 className="text-center text-2xl font-bold">{noJobsMsg}</h3>
      )}

      {jobs.length > 0 && (
        <table className="w-full max-w-7xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">PostedOn</th>
              <th className="py-2 px-4 text-left">Job Status</th>
              <th className="py-2 px-4 text-left">View Job & Applications</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-center">{index + 1}</td>
                <td className="py-3 px-4">{job.jobTitle}</td>
                <td className="py-3 px-4 max-sm:hidden">{job.jobLocation}</td>
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
      )}
    </div>
  );
};

export default ViewJobAndApplications;
