namespace JobPortalWebAPI.Models.DTO
{
    public class ReturnAppliedJobsDTO
    {
        public Guid Id { get; set; }
        public string Status { get; set; }
        public DateTime AppliedOn { get; set; }
        public ReturnJobDTO JobInfo { get; set; }
    }
}
