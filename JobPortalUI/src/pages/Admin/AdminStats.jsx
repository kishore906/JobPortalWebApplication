import { assets } from "../../assets/assets";
import Loading from "../../components/Loading";
import {
  useGetStatsQuery,
  useGetGraphsDataQuery,
} from "../../features/api/adminApi";
import { Graph1 } from "./admingraphs/Graph1";
import { Graph2 } from "./admingraphs/Graph2";

const AdminStats = () => {
  const { isLoading, error: statsErr, data: stats } = useGetStatsQuery();
  const { error: graphDataErr, data: graphData } = useGetGraphsDataQuery({
    year: 2025,
  });

  if (isLoading) return <Loading />;

  if (statsErr) return <h2>😔 Error in fetching stats.</h2>;

  if (graphDataErr) return <h2>😔 Error in fetching graph data.</h2>;

  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center lg:flex-row gap-10">
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

      {/* Graphs */}
      <div className="mt-14 flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="w-full max-w-xl h-96 p-4 rounded-xl shadow-md border-1 border-gray-200">
          <Graph1 graphData={graphData} />
        </div>
        <div className="w-full max-w-xl h-96 p-4 rounded-xl shadow-md border-1 border-gray-200">
          <Graph2 graphData={graphData} />
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
