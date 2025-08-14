namespace JobPortalWebAPI.Models.DTO
{
    public class ReturnJobDTO
    {
        public Guid Id { get; set;}
        public string? JobTitle { get; set; }
        public string? JobDescription { get; set; }
        public string? JobLevel { get; set; }
        public string? JobCategory { get; set; }
        public string? JobType { get; set; }
        public string? JobLocation { get; set; }
        public decimal JobSalary { get; set; }
        public DateTime PostedOn { get; set; }
        public string? JobStatus { get; set; }
        public ReturnCompanyDTO? Company { get; set; }
    }
}
