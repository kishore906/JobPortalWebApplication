using JobPortalWebAPI.Models.Domain;

namespace JobPortalWebAPI.Repositories
{
    public interface ITokenRepository
    {
        string CreateJWTToken(ApplicationUser user, string role);
    }
}
