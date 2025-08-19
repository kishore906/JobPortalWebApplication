using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;

namespace JobPortalWebAPI.Repositories
{
    public interface IUserJobRepository
    {
        Task<object?> GetJobByIdAsync(Guid id);
        Task<bool> SaveJobAsync(string userId, Guid jobId);
        Task<List<ReturnJobDTO>> GetAllSavedJobsAsync(string userId);
        Task<bool> UnSaveJobAsync(string userId, Guid jobId);
        Task<(bool Success, string Message)> ApplyJobAsync(string userId, Guid jobId, IFormFile resume);
        Task<List<ReturnAppliedJobsDTO>> GetAllAppliedJobsAsync(string userId);
        Task<bool> CancelApplicationAsync(string userId, Guid appId);

        // check whether user saved job or applied for the job
        Task<(bool Saved, bool Applied)> GetSavedOrAppliedAsync(string userId, Guid jobId);

        // Search and Filter Jobs Method
        Task<object> GetJobsAsync(string? searchQuery, string? jobLocation, string? jobCategory, string? jobLevel, string? jobType,  int pageNumber);
    }
}
