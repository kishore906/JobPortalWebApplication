using System.Security.Claims;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.AspNetCore.Identity;

namespace JobPortalWebAPI.Repositories
{
    public interface ICompanyUserRepository
    {
        Task<CompanyProfile> CreateAsync(CompanyProfile companyProfile);
        Task<(bool Success, string Message)> UpdateCompanyProfileAsync(string companyId, UpdateCompanyDTO updateCompanyDTO);
        Task<IdentityResult> ChangePasswordAsync(ClaimsPrincipal user, string currentPassword, string newPassword);
    }
}
