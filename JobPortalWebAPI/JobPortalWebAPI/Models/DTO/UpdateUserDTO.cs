using System.ComponentModel.DataAnnotations;

namespace JobPortalWebAPI.Models.DTO
{
    public class UpdateUserDTO
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        [Required]
        public string MobileNumber { get; set; } = string.Empty;

        public string? OldProfileImage { get; set; }

        public string? OldResume { get; set; }

        // Image Property
        public IFormFile? ProfileImage { get; set; }

        // Resume File Property
        public IFormFile? Resume { get; set; }
    }
}
