using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class ServicePackage
    {
        public int Id { get; set; }
        public string PackageName { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public int DurationDays { get; set; } // Số ngày sử dụng (30 ngày, 90 ngày...)
        public string Description { get; set; } = string.Empty;
    }
}