import { assets } from "../../assets/assets";
import moment from "moment";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetAllJobsByStatusQuery,
  useDeleteJobMutation,
} from "../../features/api/adminApi";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const AllJobs = () => {
  const [status, setStatus] = useState("Open");
  //const [jobs, setJobs] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const { isLoading, error, data: jobs } = useGetAllJobsByStatusQuery(status);
  const [
    deleteJob,
    { isSuccess: jobDeleteSuccess, error: jobDeleteErr, data: jobDeleteRes },
  ] = useDeleteJobMutation();

  useEffect(() => {
    if (error) {
      //console.log(error);
      setErrMsg(error.data.message);
    }
  }, [error]);

  useEffect(() => {
    if (jobDeleteErr) {
      console.log(jobDeleteErr);
    }

    if (jobDeleteSuccess && jobDeleteRes) {
      toast.success(jobDeleteRes.message);
    }
  }, [jobDeleteErr, jobDeleteSuccess, jobDeleteRes]);

  if (isLoading) return <Loading />;

  return (
    <div className="container p-4">
      <div className="flex gap-4">
        <button
          className={`w-28 py-2 mt-4 border-1 rounded-full ${
            status === "Open" && "bg-black text-white"
          }`}
          onClick={() => setStatus("Open")}
        >
          Active
        </button>
        <button
          className={`w-30 py-2 mt-4 border-1 rounded-full ${
            status === "Closed" && "bg-black text-white"
          }`}
          onClick={() => setStatus("Closed")}
        >
          InActive
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {errMsg && <h2 className="text-2xl font-semibold">{errMsg}</h2>}
        {jobs?.length > 0 && (
          <table className="w-full max-w-8xl bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">JobTitle</th>
                <th className="py-2 px-4 text-left">Company</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-left max-sm:hidden">PostedOn</th>
                <th className="py-2 px-4 text-left max-sm:hidden">JobType</th>
                <th className="py-2 px-4 text-left max-sm:hidden">
                  Job Status
                </th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.map((job, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4">{job.jobTitle}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src={
                        job?.company?.companyImagePath
                          ? `https://localhost:7091/${job?.company?.companyImagePath}`
                          : assets.company_logo
                      }
                      alt="profile_img"
                      className="w-8 h-8 rounded-full"
                    />
                    {job?.company?.companyName}
                  </td>
                  <td className="py-3 px-4 max-sm:hidden">{job.jobLocation}</td>
                  <td className="py-3 px-4 max-sm:hidden">
                    {moment(job.postedOn).format("ll")}
                  </td>
                  <td className="py-3 px-4 max-sm:hidden">{job.jobType}</td>
                  <td className="py-2 px-4 text-center max-sm:hidden">
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

                  <td className="px-2">
                    <div className="flex gap-3">
                      <button className="px-2 py-1 border-1 bg-blue-100 border-gray-400 rounded-sm outline-none w-22">
                        <Link
                          to={`/adminDashboard/jobInfoAndUsersApplications/${job.id}`}
                        >
                          👁️ View
                        </Link>
                      </button>
                      <button
                        className="bg-red-600 px-4 py-1 text-white rounded"
                        onClick={() => deleteJob(job?.id)}
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllJobs;
