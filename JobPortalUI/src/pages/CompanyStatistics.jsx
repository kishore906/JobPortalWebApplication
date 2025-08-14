import { assets } from "../assets/assets";

const CompanyStatistics = () => {
  return (
    <div style={{ width: "700px", padding: "20px" }}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex justify-between items-center w-full max-w-xs p-5 bg-blue-100 border-2 border-blue-300 rounded-lg">
          <img
            src={assets.suitcase_icon}
            alt="suitcase_icon"
            className="w-15"
          />
          <div className="text-center">
            <p className="font-bold text-5xl">25</p>
            <p className="text-sm font-bold">Jobs</p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full max-w-xs p-5 bg-gray-100 border-2 border-gray-300 rounded-lg">
          <img
            src={assets.person_tick_icon}
            alt="suitcase_icon"
            className="w-12"
          />
          <div className="text-center">
            <p className="font-bold text-5xl">25</p>
            <p className="text-sm font-bold">Applied Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatistics;
