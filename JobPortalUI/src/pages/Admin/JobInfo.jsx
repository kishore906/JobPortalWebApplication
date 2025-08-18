import moment from "moment";
import kconvert from "k-convert";

const JobInfo = ({ job }) => {
  return (
    <div className="mt-10 w-full max-w-4xl">
      <div className="flex items-center flex-col md:flex-row">
        <div className="w-full">
          <h2 className="text-2xl font-semibold">
            Job Title: <span className="font-light">{job?.jobTitle}</span>
          </h2>
          <h3 className="text-md font-semibold mt-3">
            Job Location: <span className="font-light">{job?.jobLocation}</span>
          </h3>
          <h3 className="text-mb font-semibold">
            PostedOn:{" "}
            <span className="font-light">
              {moment(job?.postedOn).format("ll")}
            </span>
          </h3>
        </div>
        <div className="w-full">
          <h2 className="text-md font-semibold w-full">
            Job Type: <span className="font-light">{job?.jobType}</span>
          </h2>
          <h3 className="text-md font-semibold mb-2 md:mt-2">
            Job Level: <span className="font-light">{job?.jobLevel}</span>
          </h3>
          <h3 className="text-md font-semibold mb-2 md:mt-2">
            Job Salary($):{" "}
            <span className="font-light">
              {kconvert.convertTo(job?.jobSalary)}
            </span>
          </h3>
          <h3 className="text-mb font-semibold ">
            Job Status:&nbsp;
            <span
              className={
                job?.jobStatus === "Open"
                  ? "bg-red-50 border border-red-200 px-3 py-1 rounded"
                  : "bg-red-200 border border-red-600 px-3 py-1 rounded"
              }
            >
              {job?.jobStatus}
            </span>
          </h3>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-2xl font-semibold">Job Description</h2>
        <p
          className="mt-3"
          dangerouslySetInnerHTML={{ __html: job?.jobDescription }}
        ></p>
      </div>
    </div>
  );
};

export default JobInfo;
