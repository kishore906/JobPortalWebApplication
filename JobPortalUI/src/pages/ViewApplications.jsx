import { assets, viewApplicationsPageData } from "../assets/assets";

const ViewApplications = () => {
  return (
    <div className="container mx-auto p-4">
      <div>
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

        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">UserName</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="flex items-center py-2 px-4">
                  <img
                    src={applicant.imgSrc}
                    alt="user_img"
                    className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                  />
                  <span>{applicant.name}</span>
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  {applicant.jobTitle}
                </td>
                <td className="py-2 px-4 max-sm:hidden">
                  {applicant.location}
                </td>
                <td className="py-2 px-4">
                  <a
                    href=""
                    target="_blank"
                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                  >
                    Resume{" "}
                    <img
                      src={assets.resume_download_icon}
                      alt="resume_download_icon"
                    />
                  </a>
                </td>
                <td className="py-2 px-4 text-center relative">
                  <div className="relative inline-block group">
                    <button className="text-gray-500 action-button">...</button>
                    <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-3 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                      <button className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100">
                        Accept
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
