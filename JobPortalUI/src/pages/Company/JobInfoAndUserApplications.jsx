import ViewJobInDashboard from "./ViewJobInDashboard";
import ViewApplications from "./ViewApplications";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { useGetJobByIdQuery } from "../../features/api/companyApi";

const JobInfoAndUserApplications = () => {
  const [activeBtn, setActiveBtn] = useState("jobInfo");
  const [job, setJob] = useState(null);

  const { id } = useParams();
  const { isLoading, isSuccess, error, data } = useGetJobByIdQuery(id);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error?.data?.message);
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
        <ViewJobInDashboard job={job?.jobInfo} />
      ) : (
        <ViewApplications applications={job?.applications} jobId={id} />
      )}
    </div>
  );
};

export default JobInfoAndUserApplications;
