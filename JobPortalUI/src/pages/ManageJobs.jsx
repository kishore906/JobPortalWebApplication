import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  useDeleteJobMutation,
  useGetAllJobsQuery,
  useUpdateJobStatusMutation,
} from "../features/api/companyApi";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const { isLoading, isSuccess, error, data } = useGetAllJobsQuery();
  const [
    deleteJob,
    { isSuccess: deleteSuccess, error: deleteErr, data: deleteRes },
  ] = useDeleteJobMutation();
  const [
    updateJobStatus,
    {
      isSuccess: statusUpdateSuccess,
      error: statusUpdateErr,
      data: statusUpdateres,
    },
  ] = useUpdateJobStatusMutation();
  const [jobs, setJobs] = useState([]);
  const [noJobsMsg, setNoJobdMsg] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (deleteErr) {
      console.log(deleteErr);
    }

    if (deleteSuccess && deleteRes) {
      toast.success(deleteRes.message);
    }
  }, [deleteErr, deleteRes, deleteSuccess]);

  useEffect(() => {
    if (statusUpdateErr) {
      toast.error(statusUpdateErr.data.message);
    }

    if (statusUpdateSuccess && statusUpdateres) {
      toast.success(statusUpdateres.message);
    }
  }, [statusUpdateErr, statusUpdateSuccess, statusUpdateres]);

  if (isLoading) return <Loading />;

  return (
    <div className="container p-4 max-w-7xl">
      <div className="overflow-x-auto">
        {noJobsMsg && (
          <h3 className="text-center text-2xl font-bold">{noJobsMsg}</h3>
        )}
        {jobs.length > 0 && (
          <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left max-sm:hidden">#</th>
                <th className="py-2 px-4 text-left">Job Title</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Job Type</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Job Level</th>
                <th className="py-2 px-4 text-left max-sm:hidden">Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 max-sm:hidden">{index + 1}</td>
                  <td className="py-3 px-4">{job.jobTitle}</td>
                  <td className="py-3 px-4 max-sm:hidden">{job.jobLocation}</td>
                  <td className="py-3 px-4 text-center">{job.jobType}</td>
                  <td className="py-3 px-4 text-center">{job.jobLevel}</td>
                  <td className="py-3 px-4 max-sm:hidden">
                    {moment(job.postedDate).format("ll")}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="scale-125 ml-4"
                      defaultChecked={job.jobStatus === "Open" ? true : false}
                      onClick={() => updateJobStatus(job.id)}
                    />
                  </td>
                  <td>
                    <button
                      className="mr-2 px-2 py-1 border-1 bg-blue-100 border-gray-400 rounded-sm outline-none"
                      onClick={() =>
                        navigate(
                          `/dashboard/jobInfoAndUsersApplications/${job.id}`
                        )
                      }
                    >
                      👁️ View
                    </button>
                    <button
                      className="mr-2 px-2 py-1 border-1 bg-gray-300 border-gray-400 rounded-sm outline-none"
                      onClick={() => navigate(`/dashboard/updateJob/${job.id}`)}
                    >
                      📝 Edit
                    </button>
                    <button
                      className="mr-2 px-2 py-1 border-1 bg-red-500 border-gray-400 rounded-sm outline-none"
                      onClick={() => deleteJob(job.id)}
                    >
                      🗑️ Delete
                    </button>
                    {/* <select className="py-1 bg-stone-100 border-gray-400 rounded-sm border-1 outline-none">
                      <option value="">Change Status:</option>
                      {job.jobStatus === "Open" ? (
                        <option value="Closed">Close</option>
                      ) : (
                        <option value="Open">Open</option>
                      )}
                    </select> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4 flex justify-end">
          <button
            className="bg-black text-white py-2 px-4 rounded"
            onClick={() => navigate("/dashboard/add-job")}
          >
            Add New Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
