using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProfileController(ApplicationDbContext context) { _context = context; }

        // 1. LẤY HỒ SƠ CÁ NHÂN (Dùng cho trang Profile)
        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return NotFound(new { message = "Không tìm thấy hồ sơ." });

            // Kiểm tra người đang xem có phải là Premium không
            var currentViewerId = int.Parse(User.FindFirst("UserId")?.Value!);
            var viewer = await _context.Users.FindAsync(currentViewerId);
            bool canSeeContact = (viewer != null && viewer.IsPremium) || currentViewerId == userId;

            var workerUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            return Ok(new
            {
                Profile = profile,
                UserInfo = new
                {
                    fullName = workerUser?.FullName, // Đổi thành fullName
                    phoneNumber = canSeeContact ? workerUser?.PhoneNumber : "Mua gói để xem",
                    isPremiumViewer = viewer?.IsPremium ?? false
                    
                }
            });
        }
        // 2. CẬP NHẬT HỒ SƠ (Chỉ cho phép chính chủ sửa)
        [Authorize]
        [HttpPost("update")]
        public async Task<IActionResult> UpdateProfile(Profile profile)
        {
            // Lấy UserId từ Token để bảo mật
            var currentUserId = User.FindFirst("UserId")?.Value;
            if (currentUserId != profile.UserId.ToString()) return Forbid();

            var existing = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == profile.UserId);

            if (existing == null)
            {
                _context.Profiles.Add(profile);
            }
            else
            {
                existing.Skills = profile.Skills;
                existing.Age = profile.Age;
                existing.Gender = profile.Gender;
                existing.Bio = profile.Bio;
                existing.Address = profile.Address;
                existing.Experience = profile.Experience;
                existing.Avatar = profile.Avatar;
                existing.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Hồ sơ đã được cập nhật thành công!" });
        }

        // 3. GỢI Ý ỨNG VIÊN PHÙ HỢP (Cho Chủ nhà)
        [Authorize(Roles = "Homeowner,Admin")]
        [HttpGet("suggest/{jobId}")]
        public async Task<IActionResult> GetSuggestions(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null) return NotFound(new { message = "Không tìm thấy tin tuyển dụng." });

            // Logic gợi ý nâng cao: 
            // - Khớp loại dịch vụ (ServiceType) trong kỹ năng (Skills)
            // - KHẶC KHƯƠNG: Ưu tiên cùng địa điểm (Location)
            var suggestions = await _context.Profiles
                .Where(p => p.Skills.Contains(job.ServiceType) || p.Address.Contains(job.Location))
                .ToListAsync();

            // Chuyển đổi dữ liệu để ẩn thông tin liên hệ nếu chủ nhà chưa mua gói (IsPremium)
            var currentOwnerId = int.Parse(User.FindFirst("UserId")?.Value!);
            var owner = await _context.Users.FindAsync(currentOwnerId);

            var result = suggestions.Select(p => new
            {
                p.UserId,
                p.Avatar,
                p.Skills,
                p.Experience,
                p.Bio,
                // Nếu chưa mua gói (IsPremium = false) thì ẩn SĐT
                PhoneNumber = (owner != null && owner.IsPremium) ? "Hiện số điện thoại ở đây" : "Liên hệ Admin để xem"
            });

            return Ok(result);
        }
    }
}