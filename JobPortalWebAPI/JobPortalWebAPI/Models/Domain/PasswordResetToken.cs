namespace JobPortalWebAPI.Models.Domain
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }

        public ApplicationUser User { get; set; } = null!;
    }
}
