using System.Security.Claims;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.AspNetCore.Identity;

namespace JobPortalWebAPI.Repositories
{
    public interface IUserProfileRepository
    {
        Task<(bool Success, string Message)> CreateAsync(UserProfile userProfile, IFormFile profileImage);
        Task<(bool Success, string Message)> UpdateUserAndProfileAsync(string userId, UpdateUserDTO updateUserDTO);
        Task<IdentityResult> ChangePasswordAsync(ClaimsPrincipal user, string currentPassword, string newPassword);
    }
}
