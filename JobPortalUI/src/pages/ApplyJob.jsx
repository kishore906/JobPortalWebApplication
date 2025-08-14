import { useEffect, useState } from "react";
import { jobsData, assets } from "../assets/assets";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

const ApplyJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (jobsData.length > 0) {
      const job = jobsData.find((job) => job._id === id);
      if (job !== null) {
        setJob(job);
      }
    }
  }, [id]);

  return job ? (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container mx-auto px-4 2xl:px-20">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Job title, Company logo div */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={job.companyId.image}
                alt="company_logo"
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {job.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="suitcase_icon" />
                    {job.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="location_icon" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="person_icon" />
                    {job.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="money_icon" />
                    CTC: {kconvert.convertTo(job.salary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply now button div */}
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button className="bg-gray-300 p-2.5 px-10 mb-3 rounded">
                🔖 Save
              </button>
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded">
                Apply Now
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(job.date).fromNow()}
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
                dangerouslySetInnerHTML={{ __html: job.description }}
              ></div>
              <button className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10">
                Apply Now
              </button>
            </div>

            {/* right section (more jobs) */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from {job.companyId.name}</h2>
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
