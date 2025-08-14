using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using JobPortalWebAPI.Utils;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebAPI.Repositories
{
    public class UserJobRespository : IUserJobRepository
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly string[] AllowedResumeExtensions = new[] { ".pdf" };
        private const long MaxResumeSizeBytes = 5 * 1024 * 1024;

        public UserJobRespository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ReturnJobDTO>> GetAllSavedJobsAsync(string userId)
        {
            var savedJobs = await _dbContext.SavedJobs
                         .Where(sj => sj.UserProfileId == userId && sj.Job != null && sj.Job.CompanyProfile != null)
                         .Include(sj => sj.Job)
                             .ThenInclude(j => j.CompanyProfile)
                         .Select(sj => new ReturnJobDTO
                         {
                             JobTitle = sj.Job!.JobTitle,
                             JobType = sj.Job.JobType,
                             JobLocation = sj.Job.JobLocation,
                             Company = new ReturnCompanyDTO
                             {
                                 CompanyName = sj.Job.CompanyProfile!.CompanyName,
                                 CompanyImagePath = sj.Job.CompanyProfile.CompanyImagePath!
                             }
                         })
                         .ToListAsync();

            return savedJobs;
        }

        public async Task<bool> SaveJobAsync(string userId, Guid jobId)
        {
            // Check if this SavedJob already exists (optional)
            var existing = await _dbContext.SavedJobs
                .FirstOrDefaultAsync(sj => sj.UserProfileId == userId && sj.JobId == jobId);
            if (existing != null)
                return false; 

            // Saving the Job
            var savedJob = new SavedJob
            {
                UserProfileId = userId,
                JobId = jobId,
                SavedOn = DateTime.UtcNow
            };

            await _dbContext.SavedJobs.AddAsync(savedJob);
            var saved = await _dbContext.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> UnSaveJobAsync(string userId, Guid jobId)
        {
            var savedJob = await _dbContext.SavedJobs
                         .FirstOrDefaultAsync(sj => sj.UserProfileId == userId && sj.JobId == jobId);

            if (savedJob == null)
                return false; // Not found or already unsaved

            _dbContext.SavedJobs.Remove(savedJob);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<(bool Success, string Message)> ApplyJobAsync(string userId, Guid jobId, IFormFile resume)
        {
            // Check if job is already applied or not
            bool alreadyApplied = await _dbContext.JobApplications.AnyAsync(a => a.UserProfileId == userId && a.JobId == jobId);

            if (alreadyApplied) return (false, "You have already applied for this job");

            // generate resume file path of the uploaded one
            if (resume != null)
            {
                var resumeValidationResult = FileUploadStaticClass.ValidateFile(resume, AllowedResumeExtensions, MaxResumeSizeBytes);
                if (!resumeValidationResult.isValid)
                    return (false, resumeValidationResult.errorMessage);
            }

            // creating and saving job application to db
            var jobApplication = new JobApplication
            {
                UserProfileId = userId,
                JobId = jobId,
                JobResume = await FileUploadStaticClass.SaveFileAsync(resume!, "JobResumes") // saving user uploaded resume
            };

            await _dbContext.JobApplications.AddAsync(jobApplication);
            var rows = await _dbContext.SaveChangesAsync();
            return (rows > 0, "Job application submitted successfully.");
        }

        public async Task<List<ReturnJobDTO>> GetAllAppliedJobsAsync(string userId)
        {
            var appliedJobs = await _dbContext.JobApplications
                    .Where(a => a.UserProfileId == userId)
                    .Include(a => a.Job)
                        .ThenInclude(j => j.CompanyProfile)
                    .Select(a => new ReturnJobDTO
                    {
                        JobTitle = a.Job != null ? a.Job.JobTitle : null,
                        JobType = a.Job != null ? a.Job.JobType : null,
                        JobLocation = a.Job != null ? a.Job.JobLocation : null,
                        Company = a.Job != null && a.Job.CompanyProfile != null
                            ? new ReturnCompanyDTO
                            {
                                CompanyName = a.Job.CompanyProfile.CompanyName,
                                CompanyImagePath = a.Job.CompanyProfile.CompanyImagePath!
                            }
                            : null
                    })
                    .ToListAsync();

            return appliedJobs;
        }

        public async Task<bool> CancelApplicationAsync(string userId, Guid jobId)
        {
            var application = await _dbContext.JobApplications
                    .FirstOrDefaultAsync(a => a.UserProfileId == userId && a.JobId == jobId);

            if (application == null)
                return false;

            // Deleting Job Resume of User applied
            FileUploadStaticClass.DeleteFileIfExists(application.JobResume);

            _dbContext.JobApplications.Remove(application);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        // Job search and filter method
        public async Task<object> GetJobsAsync(string? searchQuery, string? jobLocation, string? jobCategory, string? jobLevel, string? jobType, int pageNumber)
        {
            const int pageSize = 9; // number of jobs per page

            // Base query: include related CompanyProfile
            var query = _dbContext.Jobs.Include(j => j.CompanyProfile).AsQueryable();

            // Initial load (no search, no filters)
            if (string.IsNullOrWhiteSpace(searchQuery) &&
                string.IsNullOrWhiteSpace(jobLocation) &&
                string.IsNullOrWhiteSpace(jobCategory) &&
                string.IsNullOrWhiteSpace(jobLevel) &&
                string.IsNullOrWhiteSpace(jobType))
                    {
                        var latestJobs = await query
                            .OrderByDescending(j => j.PostedOn) // latest first
                            .Take(20) // only 20 jobs
                            .Select(job => new ReturnJobDTO
                            {
                                Id = job.Id,
                                JobTitle = job.JobTitle,
                                JobDescription = job.JobDescription,
                                JobCategory = jobCategory,
                                JobStatus = job.JobStatus,
                                JobType = job.JobType,
                                JobSalary = job.JobSalary,
                                JobLocation = job.JobLocation,
                                JobLevel = job.JobLevel,
                                PostedOn = job.PostedOn,
                                Company = new ReturnCompanyDTO
                                {
                                    CompanyName = job.CompanyProfile!.CompanyName,
                                    CompanyLocation = job.CompanyProfile.CompanyLocation,
                                    CompanyImagePath = job.CompanyProfile.CompanyImagePath,
                                }
                            })
                            .ToListAsync();

                    var totalpages = (int)Math.Ceiling(latestJobs.Count / (double)pageSize);

                    return new
                            {
                                totalJobs = latestJobs.Count,
                                totalPages = totalpages,
                                latestJobs
                            };
                    }

            // Apply search (JobTitle contains search term)
            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                query = query.Where(j => j.JobTitle.Contains(searchQuery));
            }

            // Apply filters (exact matches using string.Equals for case-insensitive)
            if (!string.IsNullOrWhiteSpace(jobLocation))
            {
                query = query.Where(j => j.JobLocation.Contains(jobLocation));
            }

            if (!string.IsNullOrWhiteSpace(jobCategory))
            {
                query = query.Where(j => j.JobCategory != null &&
                                         j.JobCategory.ToLower() == jobCategory.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(jobLevel))
            {
                query = query.Where(j => j.JobLevel != null &&
                                         j.JobLevel.ToLower() == jobLevel.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(jobType))
            {
                query = query.Where(j => j.JobType != null &&
                                         j.JobType.ToLower() == jobType.ToLower());
            }

            // Total count before pagination
            var totalJobs = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalJobs / (double)pageSize);

            // Check if no jobs found
            if(totalJobs == 0)
            {
                return new
                {
                    jobs = 0,
                    message = "No jobs found."
                };
            }

            // Apply pagination (Skip() + Take())
            var jobs = await query
                                        .OrderByDescending(j => j.PostedOn) // latest first
                                        .Skip((pageNumber - 1) * pageSize)
                                        .Take(pageSize)
                                        .Select(job => new ReturnJobDTO
                                        {
                                            Id = job.Id,
                                            JobTitle = job.JobTitle,
                                            JobDescription = job.JobDescription,
                                            JobStatus = job.JobStatus,
                                            JobType = job.JobType,
                                            JobSalary = job.JobSalary,
                                            JobLocation = job.JobLocation,
                                            JobLevel = job.JobLevel,
                                            PostedOn = job.PostedOn,
                                            Company = new ReturnCompanyDTO
                                            {
                                                CompanyName = job.CompanyProfile!.CompanyName,
                                                CompanyLocation = job.CompanyProfile.CompanyLocation,
                                                CompanyImagePath = job.CompanyProfile.CompanyImagePath,
                                            }
                                        })
                                        .ToListAsync();

            // return results
            return new
            {
                totalJobs,
                totalPages,
                jobs
            };
        }
    }
}
