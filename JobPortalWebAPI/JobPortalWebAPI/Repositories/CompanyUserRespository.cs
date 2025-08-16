using System.Security.Claims;
using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using JobPortalWebAPI.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebAPI.Repositories
{
    public class CompanyUserRespository : ICompanyUserRepository
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;

        // Allowed extensions and max file sizes
        private readonly string[] AllowedImageExtensions = new[] { ".jpg", ".jpeg", ".png" };
        private const long MaxImageSizeBytes = 2 * 1024 * 1024;   // 2 MB max image size

        public CompanyUserRespository(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
        }

        public async Task<(bool Success, string Message)> CreateAsync(CompanyProfile companyProfile, IFormFile companyImage)
        {
            // generate company profile image
            if (companyImage != null)
            {
                var imageValidationResult = FileUploadStaticClass.ValidateFile(companyImage, AllowedImageExtensions, MaxImageSizeBytes);
                if (!imageValidationResult.isValid)
                    return (false, imageValidationResult.errorMessage);

                // saving the new image file and update path 
                companyProfile.CompanyImagePath = await FileUploadStaticClass.SaveFileAsync(companyImage, "Images");
            }

            await dbContext.AddAsync(companyProfile);
            await dbContext.SaveChangesAsync();
            return (true, "Company Profile Created Successfully");
        }

        public async Task<(bool Success, string Message)> UpdateCompanyProfileAsync(string companyId, UpdateCompanyDTO updateCompanyDTO)
        {
            var companyUser = await userManager.Users.Include(u => u.CompanyProfile).FirstOrDefaultAsync(u => u.Id == companyId);

            if(companyUser == null)
            {
                return (false, "CompanyUser Not Found");
            }

            if(companyUser.CompanyProfile == null) 
                companyUser.CompanyProfile = new CompanyProfile { ApplicationUserId = companyId};

            // update company Email (ApplicatioUser -> IdentityUser)
            companyUser.Email = updateCompanyDTO.Email;

            // Update Company Profile details
            companyUser.CompanyProfile.CompanyName = updateCompanyDTO.CompanyName;
            companyUser.CompanyProfile.CompanyLocation = updateCompanyDTO.CompanyLocation;

            // old Image checking - user is not uploading new Image
            if (updateCompanyDTO.OldCompanyImage != null && updateCompanyDTO.CompanyImage == null)
            {
                // keep old value or path
                companyUser.CompanyProfile.CompanyImagePath = updateCompanyDTO.OldCompanyImage;
            }

            // if user uploads new image
            if (updateCompanyDTO.CompanyImage != null)
            {
                var imageValidationResult = FileUploadStaticClass.ValidateFile(updateCompanyDTO.CompanyImage, AllowedImageExtensions, MaxImageSizeBytes);
                if (!imageValidationResult.isValid)
                    return (false, imageValidationResult.errorMessage);

                // Delete old image file if exists
                FileUploadStaticClass.DeleteFileIfExists(companyUser.CompanyProfile.CompanyImagePath);

                // saving the new image file and update path 
                companyUser.CompanyProfile.CompanyImagePath = await FileUploadStaticClass.SaveFileAsync(updateCompanyDTO.CompanyImage, "Images");
            }

            var updateResult = await userManager.UpdateAsync(companyUser);
            if (!updateResult.Succeeded) return (false, "Failed to update company profile.");

            await dbContext.SaveChangesAsync();
            return (true, "CompanyProfile Updated Successfully"); // update successful
        }

        //public async Task<IdentityResult> ChangePasswordAsync(ClaimsPrincipal userPrincipal, string currentPassword, string newPassword)
        //{
        //    var user = await userManager.GetUserAsync(userPrincipal);

        //    if(user == null)
        //    {
        //        return IdentityResult.Failed(new IdentityError
        //        {
        //            Description = "User Not Found"
        //        });
        //    }
        //    return await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        //}
    }
}
