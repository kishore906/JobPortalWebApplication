using JobPortalWebAPI.Models.DTO;

namespace JobPortalWebAPI.Repositories
{
    public interface IPasswordResetRepository
    {
        public Task<(bool Success, string Message)> ForgotPasswordAsync(string email);
        public Task<PasswordResetOperationResultDTO> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
 