using System.Security.Claims;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.AspNetCore.Identity;

namespace JobPortalWebAPI.Repositories
{
    public interface ICompanyUserRepository
    {
        Task<(bool Success, string Message)> CreateAsync(CompanyProfile companyProfile, IFormFile companyImage);
        Task<(bool Success, string Message)> UpdateCompanyProfileAsync(string companyId, UpdateCompanyDTO updateCompanyDTO);
       // Task<IdentityResult> ChangePasswordAsync(ClaimsPrincipal user, string currentPassword, string newPassword);
    }
}
