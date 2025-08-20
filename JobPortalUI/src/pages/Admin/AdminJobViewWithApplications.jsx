import ApplicationsList from "./ApplicationsList";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useGetJobByIdQuery } from "../../features/api/adminApi";
import ViewJobInDashboard from "../Company/ViewJobInDashboard";

const AdminJobViewWithApplications = () => {
  const [activeBtn, setActiveBtn] = useState("jobInfo");

  const { id } = useParams();
  const { isLoading, error, data: job } = useGetJobByIdQuery(id);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <h2 className="text-center font-semibold">😔 Error in fetching job.</h2>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        <button
          className={`w-28 py-3 mt-4 border-1 rounded-full ${
            activeBtn === "jobInfo" && "bg-black text-white"
          }`}
          onClick={() => setActiveBtn("jobInfo")}
        >
          Job Info
        </button>
        <button
          className={`w-30 py-3 mt-4 border-1 rounded-full ${
            activeBtn === "applications" && "bg-black text-white"
          }`}
          onClick={() => setActiveBtn("applications")}
        >
          Applications
        </button>
      </div>

      {activeBtn === "jobInfo" ? (
        // <JobInfo job={job?.jobInfo} />
        <ViewJobInDashboard job={job?.jobInfo} />
      ) : (
        <ApplicationsList applications={job?.applicants} />
      )}
    </div>
  );
};

export default AdminJobViewWithApplications;
