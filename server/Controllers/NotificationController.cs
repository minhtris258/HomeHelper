using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập mới xem được thông báo
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách thông báo của người dùng hiện tại
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50) // Lấy 50 thông báo gần nhất
                .ToListAsync();

            return Ok(notifications);
        }

        // 2. Lấy số lượng thông báo chưa đọc (để hiện số trên Badge icon quả chuông)
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var count = await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);

            return Ok(new { unreadCount = count });
        }

        // 3. Đánh dấu một thông báo là đã đọc
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            // Kiểm tra bảo mật: Chỉ chủ nhân thông báo mới được sửa
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (notification.UserId.ToString() != userIdClaim) return Forbid();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã đánh dấu thông báo là đã đọc." });
        }

        // 4. Đánh dấu TẤT CẢ thông báo là đã đọc
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var unreadNotifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var note in unreadNotifications)
            {
                note.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã đánh dấu tất cả thông báo là đã đọc." });
        }

        // 5. Xóa một thông báo
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (notification.UserId.ToString() != userIdClaim) return Forbid();

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa thông báo." });
        }
    }
}