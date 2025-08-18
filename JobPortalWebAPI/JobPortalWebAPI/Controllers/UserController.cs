using System.Security.Claims;
using JobPortalWebAPI.CustomActionFilter;
using JobPortalWebAPI.Models.DTO;
using JobPortalWebAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserJobRepository userJobRepository;

        public UserController(IUserJobRepository userJobRepository)
        {
            this.userJobRepository = userJobRepository;
        }

        // get job by id
        [HttpGet]
        [Route("getJobById/{id}")]
        public async Task<IActionResult> GetJobById([FromRoute] Guid id)
        {
            var job = await userJobRepository.GetJobByIdAsync(id);
            if (job == null) return NotFound(new { message = "Job Not Found." });
            return Ok(job);
        }

        // Save a Job
        [HttpPost]
        [Authorize(Roles = "User")]
        [Route("saveJob")]
        public async Task<IActionResult> SaveJob([FromBody] SaveJobDTO saveJobDTO)
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Unauthorized(new { message = "Authentication required. Please login." });

            // Calling Repository method
            var result = await userJobRepository.SaveJobAsync(userId, saveJobDTO.JobId);

            if (!result) return BadRequest(new { message = "Job already saved or Invalid"});

            return Ok(new { message = "Job saved successfully."});
        }

        // Get All Saved Jobs
        [HttpGet]
        [Authorize(Roles = "User")]
        [Route("savedJobs")]
        public async Task<IActionResult> GetAllSavedJobs() {

            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            // Calling Repository method
            var savedJobs = await userJobRepository.GetAllSavedJobsAsync(userId);

            if (savedJobs.Count == 0) return NotFound(new { message = "No jobs found." });

            return Ok(savedJobs);
        }

        // UnSave a Job
        [HttpDelete]
        [Authorize(Roles = "User")]
        [Route("unsaveJob/{jobId:Guid}")]
        public async Task<IActionResult> UnsaveJob(Guid jobId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await userJobRepository.UnSaveJobAsync(userId, jobId);
            
            if (!result)
                return NotFound(new { message = "Saved job not found or already removed." });

            return Ok(new { message = "Job unsaved successfully." });
        }

        // Apply for a Job
        [HttpPost]
        [Authorize(Roles = "User")]
        [ValidateModel]
        [Route("applyJob")]
        public async Task<IActionResult> ApplyJob([FromForm] ApplyJobDTO applyJobDTO) {
            // Get loggedIn User
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Calling repository method
            var (Success, Message) = await userJobRepository.ApplyJobAsync(userId, applyJobDTO.JobId, applyJobDTO.JobResume);

            if (!Success) return BadRequest(new { message = Message });

            return Ok(new { message = Message});
        }

        // Get All Applied Jobs
        [HttpGet]
        [Authorize(Roles = "User")]
        [Route("getAppliedJobs")]
        public async Task<IActionResult> GetAllAppliedJobs()
        {
            // Get loggedIn User
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var appliedJobs = await userJobRepository.GetAllAppliedJobsAsync(userId);

            if (appliedJobs.Count == 0) return NotFound(new { message = "No Jobs Applied" });

            return Ok(appliedJobs);
        }

        // Cancel or Delete the Application
        [HttpDelete]
        [Authorize(Roles = "User")]
        [Route("cancelApplication/{id:Guid}")]
        public async Task<IActionResult> CancelApplication([FromRoute] Guid id)
        {
            // Get loggedIn User
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await userJobRepository.CancelApplicationAsync(userId, id);

            if (!result) return NotFound(new { message = "Application Not Found"});

            return Ok(new { message = "Application cancelled successfully."});
        }

        // Search for job and apply filters
        [HttpGet("search")]
        public async Task<IActionResult> SearchJobs(
                                    [FromQuery] string? searchQuery,
                                    [FromQuery] string? jobLocation,
                                    [FromQuery] string? jobCategory,
                                    [FromQuery] string? jobLevel,
                                    [FromQuery] string? jobType,       
                                    [FromQuery] int pageNumber = 1) {
            // call the repository method that does the search & filtering & pagination
            var result = await userJobRepository.GetJobsAsync(searchQuery, jobLocation, jobCategory, jobLevel, jobType, pageNumber);

            return Ok(result);
        }
    }
}
