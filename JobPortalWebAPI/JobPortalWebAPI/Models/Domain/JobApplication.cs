namespace JobPortalWebAPI.Models.Domain
{
    public class JobApplication
    {
        public Guid Id { get; set; } // Primary Key

        // Foreign Key to UserProfile
        public string? UserProfileId { get; set; }
        public UserProfile? UserProfile { get; set; }

        // Foreign Key to Job
        public Guid JobId { get; set; }
        public Job? Job { get; set; }

        public string JobResume { get; set; } = string.Empty;

        public DateTime AppliedOn { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pending";  // Options are:  Pending, Accepted, Rejected
    }
}
