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

        [Required]
        public string MobileNumber { get; set; } = string.Empty;

        // Image Property
        [Required]
        public IFormFile? ProfileImage { get; set; }

        // Resume File Property
        [Required]
        public IFormFile? Resume { get; set; }
    }
}
