using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class NotificationHub : Hub
    {
        // Hàm này giúp Client đăng ký vào một "Phòng" riêng dựa trên UserId của họ
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
    }
}