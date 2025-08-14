import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";

const AddJob = () => {
  const [job, setJob] = useState({
    title: "",
    category: "",
    location: "",
    level: "",
    salary: 0,
  });

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // Initialize Quill on initial render
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="container p-4 flex flex-col w-full items-start gap-3"
    >
      <div className="w-full">
        <p className="mb-2 font-bold">Job Title</p>
        <input
          type="text"
          placeholder="Job Title.."
          name="title"
          onChange={handleChange}
          value={job.title}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
          required
        />
      </div>

      <div className="w-full max-w-lg">
        <p className="my-2 font-bold">Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 font-bold">Job Category</p>
          <select
            onChange={handleChange}
            name="category"
            value={job.category}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
          >
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
            value={job.location}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
          >
            {JobLocations.map((location, index) => (
              <option value={location} key={index}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-bold">Job Level</p>
          <select
            onChange={handleChange}
            name="level"
            value={job.level}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded outline-none"
          >
            <option value="Beginner Level">Junior Level</option>
            <option value="Mid-Senior Level">Mid-Senior Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 font-bold">Job Salary</p>
        <input
          type="number"
          name="salary"
          placeholder="50000"
          onChange={handleChange}
          value={job.salary}
          min={0}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          required
        />
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        Add Job
      </button>
    </form>
  );
};

export default AddJob;
