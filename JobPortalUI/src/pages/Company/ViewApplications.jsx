import { assets } from "../../assets/assets";
import { useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useUpdateApplicationStatusMutation } from "../../features/api/companyApi";

const ViewApplications = ({ applications, jobId }) => {
  const [updateApplicationStatus, { isSuccess, error, data }] =
    useUpdateApplicationStatusMutation();

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error.data.message);
    }

    if (isSuccess && data) {
      toast.success(data.message);
    }
  }, [error, isSuccess, data]);

  return (
    <div className="container mx-auto">
      {applications?.length === 0 ? (
        <h2 className="text-2xl font-semibold mt-3">No Applications Yet.</h2>
      ) : (
        <table className="w-full max-w-6xl border border-gray-200 max-sm:text-sm mt-3">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">FullName</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Email</th>
              <th className="py-2 px-4 text-left max-sm:hidden">
                MobileNumber
              </th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left max-sm:hidden">AppliedOn</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((applicant, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4">
                  {applicant?.userProfile?.fullName}
                </td>
                <td className="py-2 px-4">{applicant?.userProfile?.email}</td>
                <td className="py-2 px-4">
                  {applicant?.userProfile?.mobileNumber}
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  {applicant?.userProfile?.location}
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  {moment(applicant?.appliedOn).format("ll")}
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  <a
                    href={
                      applicant.jobResume
                        ? `https://localhost:7091/${applicant.jobResume}`
                        : `https://localhost:7091/${applicant.userProfile.resume}`
                    }
                    target="_blank"
                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                  >
                    Resume
                    <img
                      src={assets.resume_download_icon}
                      alt="resume_download_icon"
                    />
                  </a>
                </td>
                <td className="py-2 px-4 max-sm:hidden">{applicant?.status}</td>
                <td className="py-2 px-4 text-center">
                  <div className="relative inline-block group">
                    <button className="text-gray-500 action-button">...</button>
                    <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-3 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                      <button
                        className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                        onClick={() =>
                          updateApplicationStatus({
                            jobId,
                            appId: applicant?.id,
                            status: { status: "Accepted" },
                          })
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        onClick={() =>
                          updateApplicationStatus({
                            jobId,
                            appId: applicant?.id,
                            status: { status: "Rejected" },
                          })
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewApplications;
