import JobInfo from "./JobInfo";
import ApplicationsList from "./ApplicationsList";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useGetJobByIdQuery } from "../../features/api/adminApi";

const AdminJobViewWithApplications = () => {
  const [activeBtn, setActiveBtn] = useState("jobInfo");
  const [job, setJob] = useState(null);

  const { id } = useParams();
  const { isLoading, isSuccess, error, data } = useGetJobByIdQuery(id);

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess && data) {
      console.log(data);
      setJob(data);
    }
  }, [error, isSuccess, data]);

  if (isLoading) return <Loading />;

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
        <JobInfo job={job?.jobInfo} />
      ) : (
        <ApplicationsList applications={job?.applicants} />
      )}
    </div>
  );
};

export default AdminJobViewWithApplications;
