import { useState } from "react";

const SearchReusable = ({ onFilter, onReset }) => {
  const [filters, setFilters] = useState({
    jobTitle: "",
    jobLocation: "",
    jobType: "",
    postedOn: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilter(updatedFilters); // send updated filters to parent
  };

  const handleReset = () => {
    setFilters({
      jobTitle: "",
      jobLocation: "",
      jobType: "",
      postedOn: "",
    });
    onReset?.(); // call parent reset
  };

  return (
    <div className="flex gap-3 mb-4">
      <input
        type="text"
        name="jobTitle"
        placeholder="Job Title..."
        value={filters.jobTitle}
        onChange={handleChange}
        className="w-80 max-w-sm px-3 py-2 border-1 border-gray-300 rounded-full outline-none"
      />
      <input
        type="text"
        name="jobLocation"
        placeholder="location..."
        value={filters.jobLocation}
        onChange={handleChange}
        className="w-70 max-w-sm px-3 py-2 border-1 border-gray-300 rounded-full outline-none"
      />
      <select
        className="w-40 max-w-sm px-3 py-2 border-1 border-gray-300 rounded-full outline-none text-gray-500"
        name="jobType"
        value={filters.jobType}
        onChange={handleChange}
      >
        <option value="">job type:</option>
        <option value="FullTime">FullTime</option>
        <option value="PartTime">PartTime</option>
        <option value="Contract">Contract</option>
        <option value="Casual">Casual</option>
        <option value="Internship">Internship</option>
      </select>
      <input
        type="date"
        name="postedOn"
        value={filters.postedOn}
        onChange={handleChange}
        className="w-40 max-w-sm px-3 py-2 border-1 border-gray-300 rounded-full outline-none text-gray-500"
      />

      <button
        className="bg-black text-white py-2 px-6 rounded-full"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default SearchReusable;
