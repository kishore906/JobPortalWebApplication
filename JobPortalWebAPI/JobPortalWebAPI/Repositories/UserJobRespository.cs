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

        public async Task<PaginatedResults<ReturnJobDTO>> GetAllSavedJobsAsync(string userId, int pageNumber)
        {
            int pageSize = 10;

            var query =  _dbContext.SavedJobs
                         .Where(sj => sj.UserProfileId == userId && sj.Job != null && sj.Job.CompanyProfile != null)
                         .Include(sj => sj.Job)
                             .ThenInclude(j => j.CompanyProfile)
                         .Select(sj => new ReturnJobDTO
                         {
                             Id = sj.JobId,
                             JobTitle = sj.Job!.JobTitle,
                             JobType = sj.Job.JobType,
                             JobLocation = sj.Job.JobLocation,
                             Company = new ReturnCompanyDTO
                             {
                                 CompanyName = sj.Job.CompanyProfile!.CompanyName,
                                 CompanyImagePath = sj.Job.CompanyProfile.CompanyImagePath!
                             }
                         });

            // Get total count (for frontend totalPages calculation)
            var totalCount = await query.CountAsync();

            // Apply pagination
            var savedJobs = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedResults<ReturnJobDTO>
            {
                Items = savedJobs,
                TotalCount = totalCount,
                PageSize = pageSize,
                PageNumber = pageNumber,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
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

            // delete the job from saved list of user
            var savedJob = await _dbContext.SavedJobs.FirstOrDefaultAsync(a => a.UserProfileId == userId && a.JobId == jobId);
            if (savedJob != null)
            {
                _dbContext.SavedJobs.Remove(savedJob);
                await _dbContext.SaveChangesAsync();
            }
            return (rows > 0, "Job application submitted successfully.");
        }

        public async Task<PaginatedResults<ReturnAppliedJobsDTO>> GetAllAppliedJobsAsync(string userId, int pageNumber)
        {
            int pageSize = 10;

            var query = _dbContext.JobApplications
                    .Where(a => a.UserProfileId == userId)
                    .Include(a => a.Job)
                        .ThenInclude(j => j.CompanyProfile)
                    .Select(a => new ReturnAppliedJobsDTO
                    {
                        Id = a.Id,
                        Status = a.Status,
                        AppliedOn = a.AppliedOn,
                        JobInfo = new ReturnJobDTO
                        {
                            Id = a.JobId,
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
                        }
                    });

            var totalCount = await query.CountAsync();

            var appliedJobs = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();  

            return new PaginatedResults<ReturnAppliedJobsDTO>
            {
                Items = appliedJobs,
                TotalCount = totalCount,
                PageSize = pageSize,
                PageNumber = pageNumber,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<bool> CancelApplicationAsync(string userId, Guid appId)
        {
            var application = await _dbContext.JobApplications
                    .FirstOrDefaultAsync(a => a.UserProfileId == userId && a.Id == appId);

            if (application == null)
                return false;

            // Deleting Job Resume of User applied
            FileUploadStaticClass.DeleteFileIfExists(application.JobResume);

            _dbContext.JobApplications.Remove(application);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        // Job search and filter method
        public async Task<PaginatedResults<ReturnJobDTO>> GetJobsAsync(string? searchQuery, string? jobLocation, string? jobCategory, string? jobLevel, string? jobType, int pageNumber)
        {
            const int pageSize = 9; // number of jobs per page

            // Base query: include related CompanyProfile
            var query = _dbContext.Jobs.Where(j => j.JobStatus == "Open").Include(j => j.CompanyProfile).AsQueryable();

            // Total count before pagination
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            // Initial load (no search, no filters)
            if (string.IsNullOrWhiteSpace(searchQuery) &&
                string.IsNullOrWhiteSpace(jobLocation) &&
                string.IsNullOrWhiteSpace(jobCategory) &&
                string.IsNullOrWhiteSpace(jobLevel) &&
                string.IsNullOrWhiteSpace(jobType))
                    {
                        var latestJobs = await query
                            .OrderByDescending(j => j.PostedOn) // latest first
                            .Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize) 
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

                    return new PaginatedResults<ReturnJobDTO>
                            {
                                 Items = latestJobs,
                                TotalCount = totalCount,
                                PageSize = pageSize,
                                PageNumber = pageNumber,
                                TotalPages = totalPages
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

             var totalJobsAfterFiltering = await query.CountAsync();
            var totalPagesAfterFiltering = (int)Math.Ceiling(totalJobsAfterFiltering / (double)pageSize);

            // Check if no jobs found
            if (totalJobsAfterFiltering == 0)
            {
                return new PaginatedResults<ReturnJobDTO>
                {
                    Items = []
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
                return new PaginatedResults<ReturnJobDTO>
                {
                    TotalCount = totalJobsAfterFiltering,
                    TotalPages = totalPagesAfterFiltering,
                    Items = jobs,
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                };
        }

        public async Task<object?> GetJobByIdAsync(Guid jobId)
        {
            var job = await _dbContext.Jobs
                    .Where(j => j.Id == jobId)
                    .Select(j => new
                    {
                        JobInfo = new ReturnJobDTO
                        {
                            Id = j.Id,
                            JobTitle = j.JobTitle,
                            JobDescription = j.JobDescription,
                            JobCategory = j.JobCategory,
                            JobType = j.JobType,
                            JobLocation = j.JobLocation,
                            JobSalary = j.JobSalary,
                            JobLevel = j.JobLevel,
                            PostedOn = j.PostedOn,
                            Company = new ReturnCompanyDTO
                            {
                                CompanyName = j.CompanyProfile!.CompanyName,
                                CompanyImagePath = j.CompanyProfile.CompanyImagePath,
                            }
                        }
                    }).FirstOrDefaultAsync();
            return job;
        }

        public async Task<(bool Saved, bool Applied)> GetSavedOrAppliedAsync(string userId, Guid jobId)
        {
            // check whether job is saved or not
            var savedJob = await _dbContext.SavedJobs.FirstOrDefaultAsync(a => a.UserProfileId == userId && a.JobId == jobId);

            if (savedJob != null)
            {
                return (true, false);
            }

            // check whether job is applied or not
            var appliedJob = await _dbContext.JobApplications.FirstOrDefaultAsync(japp => japp.UserProfileId == userId && japp.JobId == jobId);

            if (appliedJob != null)
            {
                return (false, true);
            }
            return (false, false);
        }
    }
}
