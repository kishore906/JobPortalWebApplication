
using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace JobPortalWebAPI.Repositories
{
    public class PasswordResetRepository : IPasswordResetRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public PasswordResetRepository(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<(bool Success, string Message)> ForgotPasswordAsync(string email)
        {
            // retrieving the user
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return (false, "Email Not Found");

            // Generate Token
            var rawToken = Guid.NewGuid().ToString();
            var tokenHash = BCrypt.Net.BCrypt.HashPassword(rawToken); // hash token

            // Save to DB
            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiryDate = DateTime.UtcNow.AddHours(1),
            };

            _dbContext.PasswordResetTokens.Add(resetToken);
            await _dbContext.SaveChangesAsync();

            // Send raw token in email (we only store hash in DB)
            var resetLink = $"http://localhost:5173/reset-password?email={user.Email}&token={rawToken}";

            await _emailService.SendEmailAsync(user.Email, "Password Reset",
                             $"Click <a href='{resetLink}'>here</a> to reset your password.");

            return (true, "Password reset link sent successfully to email.");
        }

        public async Task<PasswordResetOperationResultDTO> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var resultObj = new PasswordResetOperationResultDTO();

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                resultObj.Succeeded = false;
                resultObj.Errors.Add("Email Not Found.");
                return resultObj;
            }

            // Get latest valid token
            var resetToken = await _dbContext.PasswordResetTokens
                .Where(t => t.UserId == user.Id && t.ExpiryDate > DateTime.UtcNow)
                .OrderByDescending(t => t.ExpiryDate)
                .FirstOrDefaultAsync();

            if (resetToken == null || !BCrypt.Net.BCrypt.Verify(token, resetToken.TokenHash))
            {
                resultObj.Succeeded = false;
                resultObj.Errors.Add("Invalid or expired token");
                return resultObj;
            }

            // Update password
            var updateResult = await _userManager.RemovePasswordAsync(user);

            if (updateResult.Succeeded)
                updateResult = await _userManager.AddPasswordAsync(user, newPassword);

            if (!updateResult.Succeeded)
            {
                resultObj.Succeeded = false;
                resultObj.Errors.AddRange(updateResult.Errors.Select(e => e.Description));
                return resultObj;
            }


            // Delete token after use
            _dbContext.PasswordResetTokens.Remove(resetToken);
            await _dbContext.SaveChangesAsync();

            resultObj.Succeeded = true;
            resultObj.Message = "Password reset successful.";
            return resultObj;
        }
    }
}
