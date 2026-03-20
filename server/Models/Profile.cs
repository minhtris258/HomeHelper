using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }

        // Kết nối 1-1 với bảng User (Một User chỉ có một Hồ sơ)
        [Required]
        public int UserId { get; set; }
        
        public string Avatar { get; set; } = "default-avatar.png";
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        
        public string Skills { get; set; } = string.Empty; // Ví dụ: Nấu ăn, Dọn dẹp, Trông trẻ
        public string Experience { get; set; } = string.Empty; // Ví dụ: 2 năm kinh nghiệm
        
        public string Bio { get; set; } = string.Empty; // Giới thiệu bản thân
        
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}