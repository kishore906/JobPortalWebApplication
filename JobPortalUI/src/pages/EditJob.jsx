import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import {
  useGetJobIdQuery,
  useUpdateJobMutation,
} from "../features/api/companyApi";
import { JobCategories, JobLocations } from "../assets/assets";
import Loading from "../components/Loading";

const EditJob = () => {
  const [job, setJob] = useState({
    title: "",
    type: "",
    category: "",
    location: "",
    level: "",
    salary: 0,
  });

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { id } = useParams();
  const { error: jobErr, data: jobRes } = useGetJobIdQuery(id);
  const [updateJob, { isLoading, isSuccess, error, data }] =
    useUpdateJobMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobPostToBeUpdated = {
      jobTitle: job.title,
      jobDescription: DOMPurify.sanitize(
        quillRef.current.root.innerHTML
      ).trim(),
      jobType: job.type,
      jobCategory: job.category,
      jobLocation: job.location,
      jobLevel: job.level,
      jobSalary: job.salary,
    };
    updateJob({ id, jobPostToBeUpdated });
  };

  useEffect(() => {
    // Initialize Quill on initial render
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  // handling fetch job by Id
  useEffect(() => {
    console.log("fetching job...");
    if (jobErr) {
      toast.error(jobErr.data.message);
    }

    if (jobRes) {
      const fetchedJob = {
        title: jobRes.jobInfo.jobTitle,
        type: jobRes.jobInfo.jobType,
        category: jobRes.jobInfo.jobCategory,
        location: jobRes.jobInfo.jobLocation,
        level: jobRes.jobInfo.jobLevel,
        salary: jobRes.jobInfo.jobSalary,
      };
      setJob(fetchedJob);
      if (quillRef.current) {
        quillRef.current.clipboard.dangerouslyPasteHTML(
          jobRes.jobInfo.jobDescription
        );
      }
    }
  }, [jobErr, jobRes]);

  //useEffect for handling updateJob request
  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error.data.message);
    }

    if (isSuccess && data) {
      toast.success(data.message);
      navigate("/dashboard/manage-jobs");
    }
  }, [error, isSuccess, data, navigate, jobErr, jobRes]);

  return (
    <form
      onSubmit={handleSubmit}
      className="container p-4 flex flex-col w-full items-start gap-3"
    >
      <div className="w-full">
        <p className="mb-2 font-bold">Job Title</p>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={job?.title ?? ""}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
          required
        />
      </div>

      <div className="w-full max-w-3xl">
        <p className="my-2 font-bold">Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 font-bold">Job Category</p>
          <select
            onChange={handleChange}
            name="category"
            value={job?.category}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
            required
          >
            <option value="">Select:</option>
            {JobCategories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-bold">Job Location</p>
          <select
            onChange={handleChange}
            name="location"
            value={job?.location}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
            required
          >
            <option value="">Select:</option>
            {JobLocations.map((location, index) => (
              <option value={location} key={index}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-bold">Job Type</p>
          <select
            onChange={handleChange}
            name="type"
            value={job?.type}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
            required
          >
            <option value="">Select:</option>
            <option value="FullTime">Full-time</option>
            <option value="PartTime">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Casual">Casual</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-bold">Job Level</p>
          <select
            onChange={handleChange}
            name="level"
            value={job?.level}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
            required
          >
            <option value="">Select:</option>
            <option value="Entry level">Entry level</option>
            <option value="Internship">Internship</option>
            <option value="Mid-Senior level">Mid-Senior level</option>
            <option value="Senior level">Senior level</option>
            <option value="Executive level">Executive</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 font-bold">Job Salary</p>
        <input
          type="number"
          name="salary"
          onChange={handleChange}
          value={job?.salary ?? ""}
          min={25000}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px] outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
        disabled={isLoading}
      >
        Update Job
      </button>
    </form>
  );
};

export default EditJob;
