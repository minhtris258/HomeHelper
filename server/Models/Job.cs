using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic; // Thêm để dùng ICollection

namespace server.Models
{
    public class Job
    {
        public int Id { get; set; }
        
        // Khai báo Foreign Key rõ ràng
        public int OwnerId { get; set; }
        
        // Navigation property: Liên kết ngược lại với User (Chủ nhà)
        [ForeignKey("OwnerId")]
        public virtual User? Owner { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty; 
        public string ServiceType { get; set; } = string.Empty; 
        
        [Column(TypeName = "decimal(18,2)")] // Đảm bảo độ chính xác cho tiền tệ
        public decimal Salary { get; set; }
        
        public string Location { get; set; } = string.Empty;
        public string WorkingTime { get; set; } = string.Empty; 
        public string GenderReq { get; set; } = string.Empty; 
        public string AgeReq { get; set; } = string.Empty; 
        public string RequiredSkills { get; set; } = string.Empty; 
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property: Một công việc có nhiều đơn ứng tuyển
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}