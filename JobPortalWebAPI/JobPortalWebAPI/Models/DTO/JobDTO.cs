using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class JobDTO
    {
        [Required]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        public string JobDescription { get; set; } = string.Empty;

        public string JobCategory { get; set; } = string.Empty;

        [Required]
        public string JobType { get; set; } = string.Empty;

        [Required]
        public string JobLocation { get; set; } = string.Empty;

        [Required]
        public decimal JobSalary { get; set; }

        [Required]
        public string JobLevel { get; set; } = string.Empty;

        public DateTime PostedOn { get; set; }

        public string JobStatus { get; set; } = string.Empty;

        public string CompanyProfileId { get; set; } = string.Empty;
    }
}
