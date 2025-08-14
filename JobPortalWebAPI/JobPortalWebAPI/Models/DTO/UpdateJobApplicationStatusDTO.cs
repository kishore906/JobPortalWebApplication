using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class UpdateJobApplicationStatusDTO
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
