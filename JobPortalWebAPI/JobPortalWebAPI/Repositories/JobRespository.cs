using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebAPI.Repositories
{
    public class JobRespository : IJobRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public JobRespository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Job>> GetAllJobsOfTheCompanyAsync(string companyId)
        {
            return await _dbContext.Jobs.Where(j => j.CompanyProfileId == companyId).ToListAsync();
        }

        public async Task<object?> GetJobAsync(Guid jobId)
        {
            var job = await _dbContext.Jobs
                    .Where(j => j.Id == jobId)
                    .Select(j => new
                    {
                        JobInfo = new ReturnJobDTO { 
                            Id = j.Id,
                            JobTitle = j.JobTitle,
                            JobDescription = j.JobDescription,
                            JobCategory = j.JobCategory,
                            JobType = j.JobType,
                            JobLocation = j.JobLocation,
                            JobSalary = j.JobSalary,
                            JobLevel = j.JobLevel,
                            PostedOn = j.PostedOn,
                            JobStatus = j.JobStatus,
                        },
                        Applications = j.JobApplications.Select(app => new
                        {
                            app.Id,
                            app.AppliedOn,
                            app.JobResume,
                            app.Status,
                            UserProfile = new
                            {
                                fullName = app.UserProfile!.FullName,
                                location = app.UserProfile.Location,
                                mobileNumber = app.UserProfile.MobileNumber,
                                resume = app.UserProfile.ResumeFilePath,
                                email = app.UserProfile.ApplicationUser!.Email
                            }
                        })
                    })
                    .FirstOrDefaultAsync();
            return job;
        }

        public async Task<bool> PostAJob(Job job)
        {
            await _dbContext.AddAsync(job);
            var rows = await _dbContext.SaveChangesAsync();
            return rows > 0;
        }

        public async Task<(bool Success, string Message)> UpdateJobAsync(Guid jobId, Job job)
        {
            // check whether Job exists or not with the jobId
            var existingJob = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);

            if (existingJob == null) return (false, "Not Found");

            // check whether the Job is posted by the logged In User
            if(existingJob.CompanyProfileId != job.CompanyProfileId)
            {
                return (false, "Not Authorized");
            }

            // Update the Job details
            existingJob.JobTitle = job.JobTitle;
            existingJob.JobDescription = job.JobDescription;
            existingJob.JobCategory = job.JobCategory;
            existingJob.JobType = job.JobType;
            existingJob.JobLocation = job.JobLocation;
            existingJob.JobSalary = job.JobSalary;
            existingJob.JobLevel = job.JobLevel;
            existingJob.PostedOn = job.PostedOn;

            await _dbContext.SaveChangesAsync();
            return (true, "Job details updated successfully.");
        }

        public async Task<(bool Success, string Message)> DeleteJobAsync(Guid JobId, string userId)
        {
            var job = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == JobId);

            if (job == null) return (false, "Not Found");

            if (job.CompanyProfileId != userId)
            {
                return (false, "Not Authorized");
            }

            // deleting the job
            _dbContext.Jobs.Remove(job);
            await _dbContext.SaveChangesAsync();
            return (true, "Job deleted succesfully.");
        }

        public async Task<(bool Success, string Message)> ChangeJobStatusAsync(string userId, Guid jobId)
        {
            var job = await _dbContext.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);

            if (job == null) return (false, "Not Found");

            if (job.CompanyProfileId != userId)
            {
                return (false, "Not Authorized");
            }

            // update the job status
            job.JobStatus = job.JobStatus == "Open" ? "Closed" : "Open";

            await _dbContext.SaveChangesAsync();
            return (true, "Job status updated successfully.");
        }

        public async Task<bool> UpdateJobApplicationStatusAsync(Guid applicationId, string status)
        {
            var application = await _dbContext.JobApplications
                                    .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
                return false;

            application.Status = status;
            _dbContext.JobApplications.Update(application);
            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
