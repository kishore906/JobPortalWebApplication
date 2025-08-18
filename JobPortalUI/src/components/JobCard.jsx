import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 p-6 shadow rounded">
      <div className="flex items-center gap-3 font-semibold">
        <img
          src={
            job?.company?.companyImagePath
              ? `https://localhost:7091/${job?.company.companyImagePath}`
              : assets.company_icon
          }
          alt="company_logo"
          className="h-8 rounded-full border-1 border-gray-300"
        />
        <span>{job?.company?.companyName}</span>
      </div>
      <h4 className="font-bold text-xl mt-2">{job?.jobTitle}</h4>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
          {job?.jobLocation}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
          {job?.jobLevel}
        </span>
      </div>
      {/* <p
        className="text-gray-500 text-sm mt-4"
        dangerouslySetInnerHTML={{
          __html: job?.jobDescription.substring(0, 150) + "...",
        }}
      ></p> */}
      <div className="mt-4 text-sm">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            navigate(`/viewJob/${job?.id}`);
            scrollTo(0, 0);
          }}
        >
          View Details
        </button>
        {/* <button
          className="text-gray-500 border border-gray-500 rounded px-4 py-2"
          onClick={() => {
            navigate(`/viewJob/${job._id}`);
            scrollTo(0, 0);
          }}
        >
          View Details
        </button> */}
      </div>
    </div>
  );
};

export default JobCard;
