namespace JobPortalWebAPI.Models.DTO
{
    // Simple wrapper class to hold paginated results
    // 'T' means it’s a generic class
    public class PaginatedResults<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
