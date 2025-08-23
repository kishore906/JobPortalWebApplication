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
        public async Task<IActionResult> GetAllUsers([FromQuery] int pageNumber)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await adminRepository.GetAllUsersAsync(pageNumber);

            if (result.Items.Count == 0) return NotFound(new { message = "No Users Found."});

            return Ok(result);
        }

        [HttpGet("companyUsers")]
        public async Task<IActionResult> GetAllCompanyUsers([FromQuery] int pageNumber)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await adminRepository.GetAllCompanyUsersAsync(pageNumber);

            if (result.Items.Count == 0) return NotFound(new { message = "No CompanyUsers Found." });

            return Ok(result);
        }

        [HttpGet]
        [Route("jobs/{status}")]
        public async Task<IActionResult> GetAllJobsByStatus([FromRoute] string status, [FromQuery] int pageNumber)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var result = await adminRepository.GetAllJobsAsync(status, pageNumber);

            if (result.Items.Count == 0) return NotFound(new { message = "No Jobs Found." });

            return Ok(result);
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

        [HttpGet]
        [Route("getJobsAndApplicationsByMonth")]
        public async Task<IActionResult> GetJobsAndApplicationsByMonth([FromQuery] int year)
        {
            // Get logged-in user's ApplicationUserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Authentication required. Please login." });

            var data = await adminRepository.GetJobsAndApplicationsByMonth(year);
            return Ok(data);
        }
    }
}
