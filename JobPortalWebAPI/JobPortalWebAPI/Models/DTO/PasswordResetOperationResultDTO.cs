namespace JobPortalWebAPI.Models.DTO
{
    public class PasswordResetOperationResultDTO
    {
        public bool Succeeded { get; set; }
        public List<string> Errors { get; set; } = new();
        public string? Message { get; set; }
    }
}
