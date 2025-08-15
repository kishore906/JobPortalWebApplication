using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class RegisterUserDTO
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        public IFormFile? ProfileImage { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
