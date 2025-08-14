using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class ApplyJobDTO
    {
        [Required]
        public Guid JobId { get; set; }

        [Required]
        public IFormFile JobResume { get; set; } 
    }
}
