using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class SaveJobDTO
    {
        [Required]
        public Guid JobId { get; set; }
    }
}
