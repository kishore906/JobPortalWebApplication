import { assets } from "../../assets/assets";
import moment from "moment";

const ApplicationsList = ({ applications }) => {
  return (
    <div className="container mx-auto p-4">
      {applications?.length === 0 ? (
        <h2 className="text-2xl font-semibold mt-3">No Applications Yet.</h2>
      ) : (
        <table className="w-full max-w-7xl bg-white border border-gray-200 max-sm:text-sm">
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
            </tr>
          </thead>
          <tbody>
            {applications?.map((applicant, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4">{applicant?.fullName}</td>
                <td className="py-2 px-4">{applicant?.email}</td>
                <td className="py-2 px-4">{applicant?.mobileNumber}</td>
                <td className="py-2 px-4 max-sm:hidden">
                  {applicant?.location}
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  {moment(applicant?.appliedOn).format("ll")}
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  <a
                    href={`https://localhost:7091/${applicant.resumePath}`}
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
                <td className="py-2 px-4 max-sm:hidden">
                  <span
                    className={`
                      ${
                        applicant?.status === "Accepted"
                          ? "bg-green-100"
                          : applicant?.status === "Rejected"
                          ? "bg-red-400"
                          : "bg-blue-100"
                      }
                    px-4 py-1.5 rounded`}
                  >
                    {applicant?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationsList;
