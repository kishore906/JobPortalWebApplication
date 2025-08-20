using JobPortalWebAPI.Models.DTO;

namespace JobPortalWebAPI.Repositories
{
    public interface IAdminRepository
    {
        Task<List<UserSummaryDTO>> GetAllUsersAsync();
        Task<List<ReturnCompanyDTO>> GetAllCompanyUsersAsync();
        Task<List<ReturnJobDTO>> GetAllJobsAsync(string status);
        Task<object?> GetJobByIdAsync(Guid jobId);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> DeleteCompanyUserAsync(string companyUserId);
        Task<bool> DeleteJobAsync(Guid jobId);
        Task<(long usersCount, long companyCount, long activeJobsCount)> GetStats();
        Task<List<MonthlyStatsDTO>> GetJobsAndApplicationsByMonth(int year);
    }
}
