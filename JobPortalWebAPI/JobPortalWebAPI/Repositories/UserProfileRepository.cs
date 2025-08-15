using System.Security.Claims;
using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using JobPortalWebAPI.Utils;

namespace JobPortalWebAPI.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        // Allowed extensions and max file sizes
        private readonly string[] AllowedImageExtensions = new[] { ".jpg", ".jpeg", ".png" };
        private readonly string[] AllowedResumeExtensions = new[] { ".pdf" };
        private const long MaxImageSizeBytes = 2 * 1024 * 1024;   // 2 MB max image size
        private const long MaxResumeSizeBytes = 5 * 1024 * 1024;  // 5 MB max resume size


        public UserProfileRepository(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<(bool Success, string Message)> CreateAsync(UserProfile userProfile, IFormFile profileImage)
        {
            // generating profile image path
            if (profileImage != null)
            {
                var imageValidationResult = FileUploadStaticClass.ValidateFile(profileImage, AllowedImageExtensions, MaxImageSizeBytes);
                if (!imageValidationResult.isValid)
                    return (false, imageValidationResult.errorMessage);

                // saving the new image file and update path 
                userProfile.ProfileImagePath = await FileUploadStaticClass.SaveFileAsync(profileImage, "Images");
            }

            await _dbContext.AddAsync(userProfile);
            await _dbContext.SaveChangesAsync();
            return (true, "User Profile Created Successfully.");
        }

        public async Task<(bool Success, string Message)> UpdateUserAndProfileAsync(string userId, UpdateUserDTO updateUserDTO)
        {
            // retrieving the user
            var user = await _userManager.Users
                 .Include(u => u.UserProfile)
                 .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return (false, "User Not Found");
            }

            if (user.UserProfile == null)
                user.UserProfile = new UserProfile { ApplicationUserId = userId };

            // Updating Email of ApplicationUser(IdentityUser)
            user.Email = updateUserDTO.Email;

            // Updating UserProfile
            user.UserProfile.FullName = updateUserDTO.FullName;
            user.UserProfile.Location = updateUserDTO.Location;
            user.UserProfile.MobileNumber = updateUserDTO.MobileNumber;

            // Handle Profile Image Upload
            if(updateUserDTO.ProfileImage != null)
            {
                var imageValidationResult = FileUploadStaticClass.ValidateFile(updateUserDTO.ProfileImage, AllowedImageExtensions, MaxImageSizeBytes);
                if (!imageValidationResult.isValid)
                    return (false, imageValidationResult.errorMessage);

                // Delete old image file if exists
                FileUploadStaticClass.DeleteFileIfExists(user.UserProfile.ProfileImagePath);

                // saving the new image file and update path 
                user.UserProfile.ProfileImagePath = await FileUploadStaticClass.SaveFileAsync(updateUserDTO.ProfileImage, "Images");
            }

            // Handle Resume Upload
            if(updateUserDTO.Resume != null)
            {
                var resumeValidationResult = FileUploadStaticClass.ValidateFile(updateUserDTO.Resume, AllowedResumeExtensions, MaxResumeSizeBytes);
                if (!resumeValidationResult.isValid)
                    return (false, resumeValidationResult.errorMessage);

                // Deleting old resume if exists
                FileUploadStaticClass.DeleteFileIfExists(user.UserProfile.ResumeFilePath);

                // saving new resume and update file path 
                user.UserProfile.ResumeFilePath = await FileUploadStaticClass.SaveFileAsync(updateUserDTO.Resume, "Resumes");
            }

            var updateUserResult = await _userManager.UpdateAsync(user);
            if(!updateUserResult.Succeeded) return (false, "Falied to update profile");
            
            await _dbContext.SaveChangesAsync();
            return (true, "Profile Updated Successfully");
        }

        public async Task<IdentityResult> ChangePasswordAsync(ClaimsPrincipal userPrincipal, string currentPassword, string newPassword)
        {
            var user = await _userManager.GetUserAsync(userPrincipal);

            if(user == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "User Not Found."
                });
            }
            return await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        }
    }
}
