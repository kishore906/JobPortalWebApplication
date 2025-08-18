using System.Security.Claims;
using JobPortalWebAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository adminRepository;

        public AdminController(IAdminRepository adminRepository)
        {
            this.adminRepository = adminRepository;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var users = await adminRepository.GetAllUsersAsync();

            if (users.Count == 0) return NotFound(new { message = "No Users Found."});

            return Ok(users);
        }

        [HttpGet("companyUsers")]
        public async Task<IActionResult> GetAllCompanyUsers()
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var companyUsers = await adminRepository.GetAllCompanyUsersAsync();

            if (companyUsers.Count == 0) return NotFound(new { message = "No CompanyUsers Found." });

            return Ok(companyUsers);
        }

        [HttpGet]
        [Route("jobs/{status}")]
        public async Task<IActionResult> GetAllJobsByStatus([FromRoute] string status)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var jobs = await adminRepository.GetAllJobsAsync(status);

            if (jobs.Count == 0) return NotFound(new { message = "No Jobs Found." });

            return Ok(jobs);
        }

        [HttpGet]
        [Route("allJobs/{id}")]
        public async Task<IActionResult> GetJobById([FromRoute] Guid id)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var job = await adminRepository.GetJobByIdAsync(id);
            if (job == null) return NotFound(new { message = "Job Not Found."});
            return Ok(job);
        }

        [HttpDelete("user/{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string id)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await adminRepository.DeleteUserAsync(id);

            if (!result) return NotFound(new { message = "User Not Found." });

            return Ok(new { message = "User deleted sucessfully"});
        }

        [HttpDelete("companyUser/{id}")]
        public async Task<IActionResult> DeleteCompanyUser([FromRoute] string id)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await adminRepository.DeleteCompanyUserAsync(id);

            if (!result) return NotFound(new { message = "User Not Found." });

            return Ok(new { message = "User deleted sucessfully" });
        }

        [HttpDelete("job/{id}")]
        public async Task<IActionResult> DeleteJob([FromRoute] Guid id)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await adminRepository.DeleteJobAsync(id);
            if (!result) return NotFound(new { message = "No Job Found."});
            return Ok(new { message = "Job deleted successfully."});
        }

        [HttpGet("getStats")]
        public async Task<IActionResult> GetStats()
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var (usersCount, companyCount, activeJobsCount) = await adminRepository.GetStats();

            return Ok(new { usersCount, companyCount, activeJobsCount });
        }
    }
}
