using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;

namespace JobPortalWebAPI.Repositories
{
    public interface IJobRepository
    {
        Task<bool> PostAJob(Job job);
        Task<(bool Success, string Message)> UpdateJobAsync(Guid jobId, Job job);
        Task<(bool Success, string Message)> DeleteJobAsync(Guid JobId, string userId);
        Task<List<Job>> GetAllJobsOfTheCompanyAsync(string companyId);
        Task<object?> GetJobAsync(Guid jobId);
        Task<(bool Success, string Message)> ChangeJobStatusAsync(string userId, Guid jobId);
        Task<bool> UpdateJobApplicationStatusAsync(Guid applicationId, string status);
        Task<(long JobsPostedCount, long ActiveJobsCount)> GetCompanyStats(string companyId);
        Task<List<MonthlyStatsDTO>> GetDataForGraphs(string companyId, int year);
    }
}
