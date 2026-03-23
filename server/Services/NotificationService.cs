using Microsoft.AspNetCore.SignalR;
using server.Data;
using server.Models;
using server.Hubs; // Đảm bảo đúng namespace của NotificationHub

namespace server.Services
{
    public interface INotificationService
    {
        Task SendNotification(int userId, string title, string content, string url = "");
    }

    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task SendNotification(int userId, string title, string content, string url = "")
        {
            // 1. Lưu vào Database
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Content = content,
                RedirectUrl = url,
                CreatedAt = DateTime.Now
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 2. Gửi Realtime qua SignalR (để hiện Toast)
            // Lưu ý: Group name phải khớp với ID mà client đã JoinUserGroup
            await _hubContext.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", new
            {
                title,
                content,
                url,
                createdAt = notification.CreatedAt
            });
            await _hubContext.Clients.All.SendAsync("UpdateAdminStats");
        }
    }
}