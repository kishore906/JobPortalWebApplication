namespace JobPortalWebAPI.Models.Domain
{
    public class SavedJob
    {
        // Foreign Key to UserProfile
        public string? UserProfileId { get; set; }
        public UserProfile? UserProfile { get; set; }

        // Foreign Key to Job
        public Guid JobId { get; set; }
        public Job? Job { get; set; }

        public DateTime SavedOn { get; set; } = DateTime.UtcNow;
    }
}
