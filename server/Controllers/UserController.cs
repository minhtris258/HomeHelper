using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // 1. ĐĂNG KÝ: Mã hóa mật khẩu + Logic duyệt tài khoản
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Kiểm tra trùng lặp (Email hoặc Username)
            if (await _context.Users.AnyAsync(u => u.Email == request.Email || u.Username == request.Username))
                return BadRequest(new { message = "Email hoặc Tên đăng nhập đã tồn tại!" });

            // Ánh xạ từ DTO sang Entity User để lưu vào DB
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                FullName = request.FullName,
                Role = request.Role,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password), // Mã hóa
                IsApproved = (request.Role == "Worker" || request.Role == "Admin"),
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Tạo Profile trống gắn với UserId vừa sinh ra
            _context.Profiles.Add(new Profile { UserId = user.Id });
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!", userId = user.Id });
        }
        // 2. ĐĂNG NHẬP: Kiểm tra mật khẩu + Trạng thái duyệt + Trả về JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Tìm User khớp với Email HOẶC Username
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Email == request.Identifier || u.Username == request.Identifier);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return BadRequest(new { message = "Thông tin đăng nhập không chính xác!" });

            if (!user.IsApproved)
                return BadRequest(new { message = "Tài khoản của bạn đang chờ phê duyệt!" });

            var token = CreateToken(user);

            return Ok(new
            {
                token,
                role = user.Role,
                userId = user.Id,
                fullName = user.FullName
            });
        }
        // 3. CẬP NHẬT THÔNG TIN LIÊN HỆ (Bảng User)
        [Authorize] // Phải đăng nhập mới được sửa
        [HttpPut("update-contact/{userId}")]
        public async Task<IActionResult> UpdateContact(int userId, [FromBody] User updatedUser)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            // Chỉ cho phép người dùng tự sửa thông tin của chính mình (hoặc Admin)
            var currentUserId = User.FindFirst("UserId")?.Value;
            if (currentUserId != userId.ToString() && !User.IsInRole("Admin"))
                return Forbid();

            user.FullName = updatedUser.FullName;
            user.PhoneNumber = updatedUser.PhoneNumber;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật thông tin liên hệ!" });
        }

        // 4. CẬP NHẬT HỒ SƠ CHI TIẾT (Bảng Profile)
        [Authorize]
        [HttpPut("update-profile/{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromBody] Profile updatedProfile)
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return NotFound();

            var currentUserId = User.FindFirst("UserId")?.Value;
            if (currentUserId != userId.ToString()) return Forbid();

            profile.Age = updatedProfile.Age;
            profile.Gender = updatedProfile.Gender;
            profile.Address = updatedProfile.Address;
            profile.Skills = updatedProfile.Skills;
            profile.Experience = updatedProfile.Experience;
            profile.Bio = updatedProfile.Bio;
            profile.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Hồ sơ đã được cập nhật thành công!" });
        }

        // 5. ADMIN: Duyệt tài khoản Chủ nhà
        [Authorize(Roles = "Admin")]
        [HttpPut("approve/{userId}")]
        public async Task<IActionResult> ApproveUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.IsApproved = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Đã phê duyệt tài khoản của {user.FullName}" });
        }

        // 6. ADMIN: Lấy danh sách chờ duyệt
        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var pending = await _context.Users
                .Where(u => !u.IsApproved && u.Role == "Homeowner")
                .ToListAsync();
            return Ok(pending);
        }

        // Hàm tạo Token JWT
        private string CreateToken(User user)
        {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("UserId", user.Id.ToString()),
                new Claim("IsApproved", user.IsApproved.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}