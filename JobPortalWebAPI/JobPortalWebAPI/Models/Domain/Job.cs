namespace JobPortalWebAPI.Models.Domain
{
    public class Job
    {
        public Guid Id { get; set; }  // Primary Key 

        public string JobTitle { get; set; } =  string.Empty;
        public string JobDescription { get; set; } = string.Empty ;
        public string JobType { get; set; } = string.Empty;
        public string JobCategory {  get; set; } = string.Empty;
        public string JobLocation { get; set; } = string.Empty;
        public decimal JobSalary { get; set; }
        public string JobLevel { get; set; } = string.Empty;
        public DateTime PostedOn { get; set; }
        public string JobStatus { get; set; } = string.Empty;

        // FK + Navigation (refers to CompanyProfile Model)
        public  string? CompanyProfileId { get; set; }
        public CompanyProfile? CompanyProfile { get; set; }

        // Navigation Properties
        public ICollection<SavedJob> SavedByUsers { get; set; } = new List<SavedJob>();// users who saved the job
        public ICollection<JobApplication> JobApplications { get; set; }  = new List<JobApplication>();  // users applied for the job 
    }
}
