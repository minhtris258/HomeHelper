using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;
using server.Services; // Đảm bảo đã import namespace chứa INotificationService

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService; // Thêm service thông báo

        public PackageController(ApplicationDbContext context, INotificationService notificationService) 
        { 
            _context = context; 
            _notificationService = notificationService; // Inject service qua constructor
        }

        // 1. AI CŨNG XEM ĐƯỢC: Danh sách các gói dịch vụ
        [HttpGet]
        public async Task<IActionResult> GetPackages()
        {
            var packages = await _context.ServicePackages.ToListAsync();
            return Ok(packages);
        }

        // 2. CHỈ ADMIN: Tạo gói dịch vụ mới
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreatePackage(ServicePackage pkg)
        {
            _context.ServicePackages.Add(pkg);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã tạo gói dịch vụ mới thành công!", data = pkg });
        }

        // 3. CHỈ CHỦ NHÀ: Mua gói dịch vụ
        [Authorize(Roles = "Homeowner")]
        [HttpPost("buy/{packageId}")]
        public async Task<IActionResult> BuyPackage(int packageId)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var user = await _context.Users.FindAsync(userId);
            var package = await _context.ServicePackages.FindAsync(packageId);

            if (user == null || package == null)
                return NotFound(new { message = "Dữ liệu không tồn tại." });

            // Kích hoạt Premium
            user.IsPremium = true;

            // Nếu gói cũ vẫn còn hạn thì cộng dồn, nếu không thì tính từ hôm nay
            DateTime startDate = (user.PremiumExpiry > DateTime.Now)
                                 ? user.PremiumExpiry.Value
                                 : DateTime.Now;

            user.PremiumExpiry = startDate.AddDays(package.DurationDays);

            await _context.SaveChangesAsync();

            // --- THÊM THÔNG BÁO TẠI ĐÂY ---
            await _notificationService.SendNotification(
                userId: userId,
                title: "Thanh toán thành công",
                content: $"Chúc mừng! Bạn đã kích hoạt thành công gói {package.PackageName}. Hạn dùng đến: {user.PremiumExpiry?.ToString("dd/MM/yyyy")}",
                url: "/profile/membership" // Đường dẫn dẫn tới trang quản lý gói của user
            );

            return Ok(new
            {
                message = $"Thành công! Gói {package.PackageName} đã kích hoạt.",
                isPremium = true,
                premiumExpiry = user.PremiumExpiry
            });
        }

        // 4. CHỈ ADMIN: Xóa gói dịch vụ
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackage(int id)
        {
            var pkg = await _context.ServicePackages.FindAsync(id);
            if (pkg == null) return NotFound();

            _context.ServicePackages.Remove(pkg);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa gói dịch vụ." });
        }
    }
}