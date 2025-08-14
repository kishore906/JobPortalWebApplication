using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class UpdateCompanyDTO
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string CompanyLocation { get; set; } = string.Empty;

        // Image Property
        [Required]
        public IFormFile? CompanyImage { get; set; }
    }
}
