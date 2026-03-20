using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        
        // Phân quyền: Admin, Homeowner, Worker
        [Required] public string Role { get; set; } = "Worker"; 
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsPremium { get; set; } = false; // Check xem đã mua gói dịch vụ chưa
        public bool IsApproved { get; set; } = false; // Dành cho Worker, cần Admin duyệt mới được hiển thị trên hệ thống
    }
    // DTO cho Đăng ký: Chỉ lấy những thông tin cơ bản nhất
    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Worker"; // Mặc định là Worker
    }

    // DTO cho Đăng nhập: Cho phép dùng Email HOẶC Username
    public class LoginRequest
    {
        public string Identifier { get; set; } = string.Empty; // Có thể là Email hoặc Username
        public string Password { get; set; } = string.Empty;
    }
}