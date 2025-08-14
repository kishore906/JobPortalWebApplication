using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebAPI.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;

        public AdminRepository(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
        }


        public async Task<List<UserSummaryDTO>> GetAllUsersAsync()
        {
            return await dbContext.UserProfiles.Include(up => up.ApplicationUser).Select(up => new UserSummaryDTO
                {
                    Id = up.ApplicationUserId,
                    FullName = up.FullName,
                    Email = up.ApplicationUser!.Email,
                    MobileNumber = up.MobileNumber,
                    ProfileImagePath = up.ProfileImagePath
                }).ToListAsync();
        }

        public async Task<List<ReturnCompanyDTO>> GetAllCompanyUsersAsync()
        {
            return await dbContext.CompanyProfiles.Include(cp => cp.ApplicationUser).Select(cp => new ReturnCompanyDTO
            {
                Id = cp.ApplicationUserId,
                CompanyName = cp.CompanyName,
                CompanyEmail = cp.ApplicationUser!.Email,
                CompanyImagePath = cp.CompanyImagePath,
                CompanyLocation = cp.CompanyLocation
            }).ToListAsync();
        }

        public async Task<List<ReturnJobDTO>> GetAllJobsAsync(string status)
        {
            return await dbContext.Jobs.Where(j => j.JobStatus.ToLower() == status.ToLower())
                .Include(j => j.CompanyProfile).Select(j => new ReturnJobDTO
            {
                Id = j.Id,
                JobTitle = j.JobTitle,
                //JobDescription = j.JobDescription,
                JobStatus = j.JobStatus,
                JobType = j.JobType,
                JobLocation = j.JobLocation,
                //JobSalary = j.JobSalary,
                PostedOn = j.PostedOn,
                Company = new ReturnCompanyDTO
                {
                    CompanyName = j.CompanyProfile!.CompanyName,
                    //CompanyLocation = j.CompanyProfile.CompanyLocation,
                    CompanyImagePath = j.CompanyProfile.CompanyImagePath,
                }
            }).ToListAsync();
        }

        public async Task<object?> GetJobByIdAsync(Guid jobId)
        {
            var job = await dbContext.Jobs.Include(j => j.JobApplications).ThenInclude(ja => ja.UserProfile).ThenInclude(up => up.ApplicationUser).Include(j => j.CompanyProfile).FirstOrDefaultAsync(j => j.Id == jobId);

            if (job == null) return null;

            return new
            {
                JobInfo = new ReturnJobDTO
                {
                    Id = job.Id,
                    JobTitle = job.JobTitle,
                    JobDescription = job.JobDescription,
                    JobCategory = job.JobCategory,
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
                },
                Applicants = job.JobApplications.Select(
                    ja => new
                        {
                            fullName = ja.UserProfile!.FullName,
                            email = ja.UserProfile.ApplicationUser!.Email,
                            mobileNumber = ja.UserProfile.MobileNumber,
                            resumePath = ja.UserProfile.ResumeFilePath
                        }
                    )
            };
        }

        public async Task<bool> DeleteCompanyUserAsync(string companyUserId)
        {
            // Find ApplicationUser (from Identity)
            var user = await userManager.FindByIdAsync(companyUserId);

            if (user == null) return false;

            // Delete related userProfile (from UserProfile table)
            var userProfile = await dbContext.UserProfiles.FirstOrDefaultAsync(up => up.ApplicationUserId == companyUserId);

            if (userProfile == null) return false;

            if (userProfile != null)
            {
                dbContext.UserProfiles.Remove(userProfile);
                await dbContext.SaveChangesAsync();
            }

            // Finally delete the ApplicatioUser (from identity)
            var result = await userManager.DeleteAsync(user);

            return result.Succeeded;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            // Find ApplicationUser (from Identity)
            var user = await userManager.FindByIdAsync( userId );

            if (user == null) return false;

            // Delete related userProfile (from UserProfile table)
            var userProfile = await dbContext.UserProfiles.FirstOrDefaultAsync(up => up.ApplicationUserId == userId);

            if(userProfile == null) return false;

            if(userProfile != null)
            {
                dbContext.UserProfiles.Remove( userProfile );
                await dbContext.SaveChangesAsync();
            }

            // Finally delete the ApplicatioUser (from identity)
            var result = await userManager.DeleteAsync(user);

            return result.Succeeded;
        }

        public async Task<bool> DeleteJobAsync(Guid jobId)
        {
            var job = await dbContext.Jobs.FindAsync(jobId);
            if (job == null) return false;

            dbContext.Jobs.Remove(job);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<(long usersCount, long companyCount, long activeJobsCount)> GetStats()
        {
            var totalUserProfiles = await dbContext.UserProfiles.CountAsync();
            var totalCompanyProfiles = await dbContext.CompanyProfiles.CountAsync();
            var totalActiveJobs = await dbContext.Jobs.Where(j => j.JobStatus == "Open").CountAsync();

            return (totalUserProfiles, totalCompanyProfiles, totalActiveJobs);
        }
    }
}
