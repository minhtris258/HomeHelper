using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PackageController(ApplicationDbContext context) { _context = context; }

        // 1. AI CŨNG XEM ĐƯỢC: Danh sách các gói dịch vụ (Để chào mời mua)
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
        // Khi mua thành công, IsPremium của User sẽ thành true
        [Authorize(Roles = "Homeowner")]
        [HttpPost("buy/{packageId}")]
        public async Task<IActionResult> BuyPackage(int packageId)
        {
            // Lấy UserId từ Token
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var user = await _context.Users.FindAsync(userId);
            var package = await _context.ServicePackages.FindAsync(packageId);

            if (user == null || package == null) 
                return NotFound(new { message = "Người dùng hoặc Gói dịch vụ không tồn tại." });

            // LOGIC THANH TOÁN: (Ở đây bạn có thể tích hợp VNPay/Momo sau này)
            // Hiện tại chúng ta giả định thanh toán luôn thành công:
            
            user.IsPremium = true; 
            // Bạn có thể lưu thêm ngày hết hạn nếu muốn: user.PremiumExpiry = DateTime.Now.AddDays(package.DurationDays);

            await _context.SaveChangesAsync();

            return Ok(new { 
                message = $"Chúc mừng! Bạn đã kích hoạt thành công gói {package.PackageName}. " +
                          $"Bây giờ bạn có thể xem thông tin liên hệ của các ứng viên." 
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