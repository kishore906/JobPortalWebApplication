// reusable filtering function
const filterJobs = (jobs, filters) => {
  let filtered = jobs;

  if (filters.jobTitle) {
    filtered = filtered.filter((job) =>
      job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())
    );
  }

  if (filters.jobLocation) {
    filtered = filtered.filter((job) =>
      job.jobLocation.toLowerCase().includes(filters.jobLocation.toLowerCase())
    );
  }

  if (filters.jobType) {
    filtered = filtered.filter((job) =>
      job.jobType.toLowerCase().includes(filters.jobType.toLowerCase())
    );
  }

  if (filters.postedOn) {
    filtered = filtered.filter(
      (job) =>
        new Date(job.postedOn).toDateString() ===
        new Date(filters.postedOn).toDateString() // Tue Aug 12 2025
    );
  }

  return filtered;
};

export default filterJobs;
