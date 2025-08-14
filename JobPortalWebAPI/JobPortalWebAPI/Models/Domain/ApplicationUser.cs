using Microsoft.AspNetCore.Identity;

namespace JobPortalWebAPI.Models.Domain
{
    public class ApplicationUser : IdentityUser
    {
        // Common identity fields (Email, PasswordHash, Id(Guid as string), etc) comes from IdentityUser

        // Navigation Properties
        public UserProfile? UserProfile { get; set; }
        public CompanyProfile? CompanyProfile { get; set; }
    }
}
