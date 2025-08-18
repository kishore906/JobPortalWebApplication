import { assets } from "../../assets/assets";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { useGetStatsQuery } from "../../features/api/adminApi";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const { isLoading, isSuccess, error, data } = useGetStatsQuery();

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess && data) {
      console.log(data);
      setStats(data);
    }
  }, [error, isSuccess, data]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-5">
      <div className="flex flex-col items-center md:flex-row gap-3">
        <div className="flex justify-between items-center w-full max-w-2xs p-5 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
          <img
            src={assets.company_logo}
            alt="suitcase_icon"
            className="w-14.5"
          />
          <div className="text-center">
            <p className="font-bold text-5xl">{stats?.companyCount}</p>
            <p className="text-sm font-bold">Companies</p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full max-w-2xs p-5 bg-gray-100 border-2 border-gray-300 rounded-lg">
          <img
            src={assets.person_tick_icon}
            alt="suitcase_icon"
            className="w-12"
          />
          <div className="text-center">
            <p className="font-bold text-5xl">{stats?.usersCount}</p>
            <p className="text-sm font-bold">Users</p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full max-w-2xs p-5 bg-blue-100 border-2 border-blue-300 rounded-lg">
          <img
            src={assets.suitcase_icon}
            alt="suitcase_icon"
            className="w-13.5"
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

export default AdminStats;
