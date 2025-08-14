using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;

namespace JobPortalWebAPI.Repositories
{
    public interface IUserJobRepository
    {
        Task<bool> SaveJobAsync(string userId, Guid jobId);
        Task<List<ReturnJobDTO>> GetAllSavedJobsAsync(string userId);
        Task<bool> UnSaveJobAsync(string userId, Guid jobId);
        Task<(bool Success, string Message)> ApplyJobAsync(string userId, Guid jobId, IFormFile resume);
        Task<List<ReturnJobDTO>> GetAllAppliedJobsAsync(string userId);
        Task<bool> CancelApplicationAsync(string userId, Guid jobId);

        // Search and Filter Jobs Method
        Task<object> GetJobsAsync(string? searchQuery, string? jobLocation, string? jobCategory, string? jobLevel, string? jobType,  int pageNumber);
    }
}
