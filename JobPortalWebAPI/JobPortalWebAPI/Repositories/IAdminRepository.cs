using JobPortalWebAPI.Models.DTO;

namespace JobPortalWebAPI.Repositories
{
    public interface IAdminRepository
    {
        Task<PaginatedResults<UserSummaryDTO>> GetAllUsersAsync(int pageNumber);
        Task<PaginatedResults<ReturnCompanyDTO>> GetAllCompanyUsersAsync(int pageNumber);
        Task<PaginatedResults<ReturnJobDTO>> GetAllJobsAsync(string status, int pageNumber);
        Task<object?> GetJobByIdAsync(Guid jobId);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> DeleteCompanyUserAsync(string companyUserId);
        Task<bool> DeleteJobAsync(Guid jobId);
        Task<(long usersCount, long companyCount, long activeJobsCount)> GetStats();
        Task<List<MonthlyStatsDTO>> GetJobsAndApplicationsByMonth(int year);
    }
}
