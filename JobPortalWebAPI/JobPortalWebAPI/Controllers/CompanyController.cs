using System.Security.Claims;
using JobPortalWebAPI.CustomActionFilter;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using JobPortalWebAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly IJobRepository jobRepository;

        public CompanyController(IJobRepository jobRepository)
        {
            this.jobRepository = jobRepository;
        }

        // POST: /api/Company/postJob
        [HttpPost]
        [Authorize(Roles = "Recruiter")] // only company users allowed to post jobs
        [ValidateModel]
        [Route("postJob")]
        public async Task<IActionResult> PostJob([FromBody] JobDTO jobDTO) {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Unauthorized(new { message = "Authentication required. Please login." });

            // creating Job model from jobDTO
            var job = new Job
            {
                JobTitle = jobDTO.JobTitle,
                JobDescription = jobDTO.JobDescription,
                JobType = jobDTO.JobType,
                JobCategory = jobDTO.JobCategory,
                JobLocation = jobDTO.JobLocation,
                JobSalary = jobDTO.JobSalary,
                JobLevel = jobDTO.JobLevel,
                PostedOn = DateTime.UtcNow,
                JobStatus = "Open",
                CompanyProfileId = userId
            };

            // Saving job to the db
            var result = await jobRepository.PostAJob(job);

            if (!result) return BadRequest(new { error = "Unable to post a ajob."});

            return Ok(new { message = "Job Posted Successfully."});
        }

        // Edit Job
        [HttpPut]
        [Authorize(Roles = "Recruiter")]
        [ValidateModel]
        [Route("updateJob/{id:Guid}")]
        public async Task<IActionResult> UpdateJob([FromRoute] Guid id, [FromBody] JobDTO jobDTO)
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Unauthorized(new { message = "Authentication required. Please login." });
            
            Console.WriteLine(jobDTO);

            // Converting JobDTO to Job model
            var job = new Job
            {
                JobTitle = jobDTO.JobTitle,
                JobDescription = jobDTO.JobDescription,
                JobType = jobDTO.JobType,
                JobCategory = jobDTO.JobCategory,
                JobLocation = jobDTO.JobLocation,
                JobSalary = jobDTO.JobSalary,
                JobLevel = jobDTO.JobLevel,
                PostedOn = DateTime.UtcNow,
                CompanyProfileId = userId,
            };

            // calling respository method
            var (Success, Message) = await jobRepository.UpdateJobAsync(id, job);

            if (!Success && Message == "Not Found") return NotFound(new { message = "Job Not Found."}); 

            if(!Success && Message == "Not Authorized") return StatusCode(StatusCodes.Status403Forbidden, new { message = "Not Authorized to update the job." });

            return Ok(new { message = Message});
        }


        // Delete Job
        [HttpDelete]
        [Authorize(Roles = "Recruiter")]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteJob([FromRoute] Guid id)
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Unauthorized(new { message = "Authentication required. Please login." });

            // calling respository method
            var (Success, Message) = await jobRepository.DeleteJobAsync(id, userId);

            if (!Success && Message == "Not Found") return NotFound(new { message = "Job Not Found." });

            if (!Success && Message == "Not Authorized") return StatusCode(StatusCodes.Status403Forbidden, new { message = "Not Authorized to update the job." });

            return Ok(new { message = Message});
        }

        // Get All Jobs of the Company
        [HttpGet]
        [Authorize(Roles = "Recruiter")]
        [Route("getAllJobs")]
        public async Task<IActionResult> GetAllJobsOfTheCompany()
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            // get all the jobs by calling repository method
            var jobs = await jobRepository.GetAllJobsOfTheCompanyAsync(userId);

            if (jobs.Count == 0) return Ok(new { message = "No jobs are found." } );

            return Ok(jobs);
        }

        // Get Single Job & display all the Users applied for the Job
        [HttpGet]
        [Authorize(Roles = "Recruiter")]
        [Route("getJob/{id:Guid}")]
        public async Task<IActionResult> GetJob([FromRoute] Guid id)
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            // calling repository method to get job details
            var job = await jobRepository.GetJobAsync(id);

            if (job == null) return NotFound(new { messae = "No job found." });

            return Ok(job);
        }

        // Update Job Status "Open" or "Closed"
        [HttpPatch]
        [Authorize(Roles = "Recruiter")]
        [Route("updateJobStatus/{id:Guid}")]
        public async Task<IActionResult> UpdateJobStatus([FromRoute] Guid id) {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            // calling repository method
            var (Success, Message) = await jobRepository.ChangeJobStatusAsync(userId, id);

            if (!Success && Message == "Not Found") return NotFound(new { message = "Job Not Found." });

            if (!Success && Message == "Not Authorized") return StatusCode(StatusCodes.Status403Forbidden, new { message = "Not Authorized to update the job." });

            return Ok(new { message = Message });
        }

        // Update Status for the Users who applied for the specific Job
        [HttpPut]
        [Authorize(Roles = "Recruiter")]
        [Route("updateJobApplicationStatus/{id:Guid}")]
        public async Task<IActionResult> UpdateJobApplicationStatus(Guid id, [FromBody] UpdateJobApplicationStatusDTO updateStatusDTO) {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await jobRepository.UpdateJobApplicationStatusAsync(id, updateStatusDTO.Status);

            if (!result) return NotFound(new { message = "Job application not found." });

            return Ok(new { message = "Status updated successfully." });
        }

        [HttpGet]
        [Authorize(Roles ="Recruiter")]
        [Route("getCompanyStats")]
        public async Task<IActionResult> GetCompanyStats()
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var (JobsPostedCount, ActiveJobsCount) = await jobRepository.GetCompanyStats(userId);

            return Ok(new { JobsPostedCount, ActiveJobsCount });
        }

        [HttpGet]
        [Authorize(Roles = "Recruiter")]
        [Route("getDataForGraphs")]
        public async Task<IActionResult> GetDataForStats([FromQuery] int year)
        {
            // Get current logged-in user's ApplicationUserId (string)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var data = await jobRepository.GetDataForGraphs(userId, year);
            return Ok(data);
        } 
    }
}
