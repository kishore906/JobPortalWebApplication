import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import moment from "moment";
import Loading from "../../components/Loading";
import {
  useGetAllSavedJobsQuery,
  useGetAllAppliedJobsQuery,
  useUnSaveJobMutation,
  useWithdrawApplicationMutation,
} from "../../features/api/userApi";

const Applications = () => {
  const [showTable, setShowTable] = useState("Applied Jobs");
  const [savedJobs, setSavedJobs] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const { isLoading, isSuccess, error, data } = useGetAllSavedJobsQuery();
  const {
    isSuccess: fetchppliedJobsSuccess,
    error: fetchAppliedJobsErr,
    data: fetchAppliedJobsRes,
  } = useGetAllAppliedJobsQuery();
  const [unSaveJob, { error: unsaveErr, data: unsaveRes }] =
    useUnSaveJobMutation();
  const [withdrawApplication, { error: withdrawErr, data: withdrawRes }] =
    useWithdrawApplicationMutation();

  useEffect(() => {
    if (error) {
      console.log(error);
      setErrMsg(error.data.message);
    }

    if (isSuccess && data) {
      setSavedJobs(data);
    }
  }, [error, isSuccess, data]);

  useEffect(() => {
    if (fetchAppliedJobsErr) {
      console.log(fetchAppliedJobsErr);
      setErrMsg(fetchAppliedJobsErr.data.message);
    }

    if (fetchppliedJobsSuccess && fetchAppliedJobsRes) {
      setAppliedJobs(fetchAppliedJobsRes);
    }
  }, [fetchAppliedJobsErr, fetchppliedJobsSuccess, fetchAppliedJobsRes]);

  useEffect(() => {
    if (unsaveErr) {
      console.log(unsaveErr);
    }

    if (unsaveRes) {
      toast.success(unsaveRes.message);
    }
  }, [unsaveErr, unsaveRes]);

  useEffect(() => {
    if (withdrawErr) {
      console.log(withdrawErr);
    }

    if (withdrawRes) {
      toast.success(withdrawRes.message);
    }
  }, [withdrawErr, withdrawRes]);

  if (isLoading) return <Loading />;

  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <div className="flex gap-3 mb-4">
          <div
            className={`px-4 py-2 border border-gray-300 rounded-full ${
              showTable === "Applied Jobs" && "bg-black text-white"
            }`}
          >
            <h2
              className="text-lg font-semibold"
              onClick={() =>
                setShowTable(
                  showTable === "Applied Jobs" ? "Saved Jobs" : "Applied Jobs"
                )
              }
            >
              Applied Jobs
            </h2>
          </div>
          <div
            className={`px-4 py-2 border border-gray-300 rounded-full ${
              showTable === "Saved Jobs" && "bg-black text-white"
            }`}
          >
            <h2
              className="text-lg font-semibold"
              onClick={() =>
                setShowTable(
                  showTable === "Saved Jobs" ? "Applied Jobs" : "Saved Jobs"
                )
              }
            >
              Saved Jobs
            </h2>
          </div>
        </div>

        {showTable === "Saved Jobs" ? (
          <>
            {/* <input type="file" accept="application/pdf" onChange={(e) => e.target.files[0]} /> */}
            {errMsg && <h2 className="text-2xl font-semibold">{errMsg}</h2>}
            {savedJobs?.length > 0 && (
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="border border-gray-200">
                    <th className="py-3 px-4 text-left">Company</th>
                    <th className="py-3 px-4 text-left">JobTitle</th>
                    <th className="py-3 px-4 text-left max-sm:hidden">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left">JobType</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {savedJobs?.map((job, index) => (
                    <tr key={index} className="border border-gray-200">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img
                          src={
                            job?.company?.companyImagePath
                              ? `https://localhost:7091/${job?.company?.companyImagePath}`
                              : assets.company_logo
                          }
                          alt="company_logo"
                          className="w-8 h-8"
                        />
                        {job?.company?.companyName}
                      </td>
                      <td className="py-2 px-4">{job?.jobTitle}</td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {job?.jobLocation}
                      </td>
                      <td className="py-2 px-4">{job?.jobType}</td>
                      <td className="text-center">
                        <button
                          className="mr-2 px-2 py-1 border-1 bg-red-500 border-gray-400 rounded-sm outline-none"
                          onClick={() => unSaveJob(job?.id)}
                        >
                          Unsave
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>
            {/* <input type="file" accept="application/pdf" onChange={(e) => e.target.files[0]} /> */}
            {errMsg && <h2 className="text-2xl font-semibold">{errMsg}</h2>}
            {appliedJobs?.length > 0 && (
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="border border-gray-200">
                    <th className="py-3 px-4 text-left">Company</th>
                    <th className="py-3 px-4 text-left">JobTitle</th>
                    <th className="py-3 px-4 text-left max-sm:hidden">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left max-sm:hidden">
                      AppliedOn
                    </th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedJobs?.map((application, index) => (
                    <tr key={index} className="border border-gray-200">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img
                          src={
                            application?.jobInfo?.company?.companyImagePath
                              ? `https://localhost:7091/${application?.jobInfo?.company?.companyImagePath}`
                              : assets.company_logo
                          }
                          alt="company_logo"
                          className="w-8 h-8"
                        />
                        {application?.jobInfo?.company?.companyName}
                      </td>
                      <td className="py-2 px-4">
                        {application?.jobInfo?.jobTitle}
                      </td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {application?.jobInfo?.jobLocation}
                      </td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {moment(application?.appliedOn).format("ll")}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`${
                            application?.status === "Accepted"
                              ? "bg-green-100"
                              : application?.status === "Rejected"
                              ? "bg-red-400"
                              : "bg-blue-100"
                          } px-4 py-1.5 rounded`}
                        >
                          {application?.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          className="mr-2 px-2 py-1 border-1 bg-red-500 border-gray-400 rounded-sm outline-none"
                          onClick={() => withdrawApplication(application?.id)}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Applications;
