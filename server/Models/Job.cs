using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Job
    {
        public int Id { get; set; }
        public int OwnerId { get; set; } // ID của chủ nhà đăng tin
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty; // Full-time, Part-time...
        public string ServiceType { get; set; } = string.Empty; // Giúp việc, trông trẻ...
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }
        
        public string Location { get; set; } = string.Empty;
        public string GenderReq { get; set; } = string.Empty; // Yêu cầu giới tính
        public int AgeReq { get; set; } // Yêu cầu độ tuổi
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}