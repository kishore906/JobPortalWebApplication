import { assets } from "../../assets/assets";
//import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import {
  useGetCompanyStatsQuery,
  useGetDataForGraphsQuery,
} from "../../features/api/companyApi";
import { Graph1 } from "./companygraphs/Graph1";

const CompanyStatistics = () => {
  const { isLoading, error: statsErr, data: stats } = useGetCompanyStatsQuery();
  const { error: graphDataErr, data: graphData } = useGetDataForGraphsQuery({
    year: 2025,
  });

  if (isLoading) return <Loading />;

  if (statsErr)
    return (
      <h2 className="text-center font-semibold">😔 Error in fetching Stats.</h2>
    );

  if (graphDataErr)
    return (
      <h2 className="text-center font-semibold">
        😔 Error in fetching Graph Data.
      </h2>
    );

  return (
    <div className="p-[20px]">
      <div className="flex flex-col justify-center items-center md:flex-row gap-10">
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

      {/* Graph */}
      <div className="mt-10 w-full max-w-6xl h-125 p-4 rounded-xl shadow-md border-1 border-gray-200 mx-auto">
        <Graph1 graphData={graphData} />
      </div>
    </div>
  );
};

export default CompanyStatistics;
