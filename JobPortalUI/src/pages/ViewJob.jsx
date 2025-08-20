import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import { toast } from "react-toastify";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import {
  useGetJobByIdQuery,
  useSaveJobMutation,
  useApplyJobMutation,
  useGetSavedOrAppliedJobStatusQuery,
  useUnSaveJobMutation,
} from "../features/api/userApi";

const ViewJob = ({ setShowUserLogin, setShowRecruiterLogin }) => {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.authResult);

  // state variables
  const [saJobStatus, setSAJobStaus] = useState(null);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [resume, setResume] = useState(null);

  const navigate = useNavigate();

  // get query & mutations
  const { isLoading, error, data: job } = useGetJobByIdQuery(id);
  const [saveJob, { isLoading: saveJobLoading }] = useSaveJobMutation();
  const [applyJob, { isLoading: applyJobLoading }] = useApplyJobMutation();
  const {
    isSuccess: saJobSuccess,
    error: saJobErr,
    data: saJobRes,
  } = useGetSavedOrAppliedJobStatusQuery(id);
  const [unSaveJob] = useUnSaveJobMutation();

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.info("Please Login.");
      navigate("/");
    } else {
      try {
        if (saJobStatus?.savedJob) {
          console.log("inside unsave");
          //unsave job
          const result = await unSaveJob(id).unwrap();
          toast.success(result.message);
        } else {
          // save job
          const result = await saveJob({ jobId: id }).unwrap();
          toast.success(result.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleApplyJob = () => {
    if (!isAuthenticated) {
      toast.info("Please Login.");
      navigate("/");
    } else {
      setShowUploadResume(true);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("jobId", id);
    data.append("jobResume", resume);

    try {
      const result = await applyJob(data).unwrap();
      toast.success(result.message);
      setShowUploadResume(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (saJobErr) {
      console.log(saJobErr);
    }

    if (saJobSuccess && saJobRes) {
      setSAJobStaus(saJobRes);
    }
  }, [saJobErr, saJobSuccess, saJobRes]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <h2 className="text-center font-semibold">😔 Error in fetching job.</h2>
    );

  return (
    <>
      <Navbar
        setShowUserLogin={setShowUserLogin}
        setShowRecruiterLogin={setShowRecruiterLogin}
      />

      <div className="min-h-screen flex flex-col py-10 container mx-auto px-4 2xl:px-20">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Job title, Company logo div */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={
                  job?.jobInfo?.company?.companyImagePath
                    ? `https://localhost:7091/${job?.jobInfo?.company?.companyImagePath}`
                    : assets.company_logo
                }
                alt="company_logo"
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {job?.jobInfo?.jobTitle}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="suitcase_icon" />
                    {job?.jobInfo?.company?.companyName}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="location_icon" />
                    {job?.jobInfo?.jobLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="person_icon" />
                    {job?.jobInfo?.jobLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="money_icon" />
                    Salary: {kconvert.convertTo(job?.jobInfo?.jobSalary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply now button div */}
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              {saJobStatus?.savedJob && !saJobStatus?.appliedJob ? (
                <button
                  className="bg-gray-300 p-2.5 px-10 mb-3 rounded"
                  disabled={saveJobLoading}
                  onClick={handleSaveJob}
                >
                  🔖 Saved
                </button>
              ) : !saJobStatus?.appliedJob ? (
                <button
                  className="bg-gray-300 p-2.5 px-10 mb-3 rounded"
                  disabled={saveJobLoading}
                  onClick={handleSaveJob}
                >
                  🔖 Save
                </button>
              ) : null}
              <button
                className="bg-blue-600 p-2.5 px-10 text-white rounded"
                disabled={saJobStatus?.appliedJob || applyJobLoading}
                onClick={handleApplyJob}
              >
                {saJobStatus?.appliedJob ? "Applied" : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(job?.jobInfo?.postedOn).fromNow()}
              </p>
            </div>
          </div>

          {/* Complete Job Description div */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            {/* left section (job description) */}
            <div className="w-full lg:w:2/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{
                  __html: job?.jobInfo?.jobDescription,
                }}
              ></div>
            </div>

            {/* right section (more jobs) */}
            {/* <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from {job?.company?.companyName}</h2>
              {jobsData
                .filter(
                  (eachjob) =>
                    eachjob._id !== job._id &&
                    eachjob.companyId._id === job.companyId._id
                )
                .filter((job) => true)
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div> */}
          </div>
        </div>
      </div>

      {showUploadResume && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <form
            className="relative bg-white p-10 rounded-xl text-slate-500"
            onSubmit={handleFinalSubmit}
          >
            <h1 className="text-center text-2xl text-neutral-700 font-medium">
              Please upload resume
            </h1>

            <div className="my-10">
              <label htmlFor="resume" className="flex items-center">
                <img
                  src={assets.resume_icon}
                  alt="upload_resume_img"
                  className="w-16 rounded-full"
                />
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-600 w-40 text-white py-2 rounded-full mt-4 block mx-auto"
              disabled={applyJobLoading}
            >
              Apply
            </button>

            {/* Close Icon */}
            <img
              className="absolute top-5 right-5 cursor-pointer"
              src={assets.cross_icon}
              alt="close_icon"
              onClick={() => setShowUploadResume(false)}
            />
          </form>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ViewJob;
