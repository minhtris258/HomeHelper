namespace server.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; } // ID người nhận thông báo
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string RedirectUrl { get; set; } = string.Empty; // Đường dẫn khi nhấn vào thông báo
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}