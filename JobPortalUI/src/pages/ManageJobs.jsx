import { manageJobsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ManageJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left max-sm:hidden">#</th>
              <th className="py-2 px-4 text-left">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-center">Applicants</th>
              <th className="py-2 px-4 text-left">Visible</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4 max-sm:hidden">{index + 1}</td>
                <td className="py-2 px-4">{job.title}</td>
                <td className="py-2 px-4 max-sm:hidden">
                  {moment(job.date).format("ll")}
                </td>
                <td className="py-2 px-4 max-sm:hidden">{job.location}</td>
                <td className="py-2 px-4 text-center">{job.applicants}</td>
                <td className="py-2 px-4">
                  <input type="checkbox" className="scale-125 ml-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
