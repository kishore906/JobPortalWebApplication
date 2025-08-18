import { assets } from "../assets/assets";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useGetCompanyStatsQuery } from "../features/api/companyApi";

const CompanyStatistics = () => {
  const [stats, setStats] = useState(null);
  const { isLoading, isSuccess, error, data } = useGetCompanyStatsQuery();

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess && data) {
      setStats(data);
    }
  }, [error, isSuccess, data]);

  if (isLoading) return <Loading />;

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
            <p className="font-bold text-5xl">{stats?.jobsPostedCount}</p>
            <p className="text-sm font-bold">Posted Jobs</p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full max-w-xs p-5 bg-gray-100 border-2 border-gray-300 rounded-lg">
          <img
            src={assets.active_job_icon}
            alt="suitcase_icon"
            className="w-16"
          />
          <div className="text-center">
            <p className="font-bold text-5xl">{stats?.activeJobsCount}</p>
            <p className="text-sm font-bold">Active Jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatistics;
