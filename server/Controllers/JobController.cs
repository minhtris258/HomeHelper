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
    public class JobController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH TIN TUYỂN DỤNG (Có bộ lọc Tìm kiếm)
        // Ví dụ: api/job?location=Quận 1&minSalary=500000
        [HttpGet]
        public async Task<IActionResult> GetJobs(
            [FromQuery] string? location, 
            [FromQuery] string? serviceType, 
            [FromQuery] decimal? minSalary)
        {
            var query = _context.Jobs.AsQueryable();

            // Lọc theo địa điểm
            if (!string.IsNullOrEmpty(location))
                query = query.Where(j => j.Location.Contains(location));

            // Lọc theo loại dịch vụ
            if (!string.IsNullOrEmpty(serviceType))
                query = query.Where(j => j.ServiceType == serviceType);

            // Lọc theo mức lương tối thiểu
            if (minSalary.HasValue)
                query = query.Where(j => j.Salary >= minSalary.Value);

            var jobs = await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
            return Ok(jobs);
        }

        // 2. XEM CHI TIẾT 1 TIN ĐĂNG
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound(new { message = "Tin tuyển dụng không tồn tại." });
            return Ok(job);
        }

        // 3. CHỦ NHÀ ĐĂNG TIN MỚI (Cần Login)
        [Authorize(Roles = "Homeowner")]
        [HttpPost]
        public async Task<IActionResult> PostJob(Job job)
        {
            // Tự động lấy OwnerId từ Token của người đang đăng nhập
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            
            job.OwnerId = int.Parse(userIdClaim);
            job.CreatedAt = DateTime.Now;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // 4. CHỦ NHÀ SỬA TIN (Chỉ được sửa tin của chính mình)
        [Authorize(Roles = "Homeowner")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, Job updatedJob)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (job.OwnerId.ToString() != userIdClaim) return Forbid();

            job.Title = updatedJob.Title;
            job.Description = updatedJob.Description;
            job.Salary = updatedJob.Salary;
            job.Location = updatedJob.Location;
            job.JobType = updatedJob.JobType;
            job.ServiceType = updatedJob.ServiceType;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật tin đăng!" });
        }

        // 5. XÓA TIN (Chủ nhà xóa tin của mình hoặc Admin xóa tin vi phạm)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            var userIdClaim = User.FindFirst("UserId")?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Kiểm tra: Nếu không phải Admin VÀ cũng không phải chủ sở hữu tin đăng thì cấm xóa
            if (userRole != "Admin" && job.OwnerId.ToString() != userIdClaim)
                return Forbid();

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa tin đăng thành công!" });
        }
    }
}