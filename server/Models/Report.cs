namespace server.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int ReporterId { get; set; } // Người tố cáo (Worker)
        public int TargetJobId { get; set; } // Tin đăng bị tố cáo
        public string Reason { get; set; } = string.Empty; // Lý do: Lừa đảo, thái độ xấu...
        public string Description { get; set; } = string.Empty; // Chi tiết vụ việc
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Processed
    }
}