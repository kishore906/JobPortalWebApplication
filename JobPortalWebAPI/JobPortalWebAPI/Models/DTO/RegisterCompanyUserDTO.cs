using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class RegisterCompanyUserDTO
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string CompanyLocation { get; set; } = string.Empty;

        [Required]
        public IFormFile? CompanyImage { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
