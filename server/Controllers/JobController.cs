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

        // 1. LẤY DANH SÁCH TIN (api/Job)
        [HttpGet]
        [HttpGet]
        public async Task<IActionResult> GetJobs(
    [FromQuery] string? location,
    [FromQuery] string? keyword,
    [FromQuery] decimal? minSalary,
    [FromQuery] string? jobType,     // Thêm lọc loại công việc
    [FromQuery] string? serviceType  // Thêm lọc loại dịch vụ
)
        {
            var query = _context.Jobs.AsQueryable();

            // Lọc theo địa điểm (Thành phố/Quận/Huyện)
            if (!string.IsNullOrEmpty(location))
                query = query.Where(j => j.Location.Contains(location));

            // Lọc theo từ khóa (Tiêu đề hoặc Mô tả)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(j => j.Title.Contains(keyword) || j.Description.Contains(keyword));
            }

            // Lọc theo mức lương tối thiểu
            if (minSalary.HasValue)
                query = query.Where(j => j.Salary >= minSalary.Value);

            // Lọc theo Loại công việc (Full-time, Part-time...)
            if (!string.IsNullOrEmpty(jobType))
                query = query.Where(j => j.JobType == jobType);

            // Lọc theo Loại dịch vụ (Giúp việc, Trông trẻ...)
            if (!string.IsNullOrEmpty(serviceType))
                query = query.Where(j => j.ServiceType.Contains(serviceType));

            var jobs = await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
            return Ok(jobs);
        }
        // 2. CHI TIẾT TIN (api/Job/{id})
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound(new { message = "Tin không tồn tại." });
            return Ok(job);
        }

        // 3. DANH SÁCH TIN CỦA TÔI (api/Job/my-jobs) - QUAN TRỌNG: Đặt trên Post/Put để tránh nhầm ID
        [Authorize]
        [HttpGet("my-jobs")]
        public async Task<IActionResult> GetMyJobs()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            var userId = int.Parse(userIdClaim);
            var jobs = await _context.Jobs.Where(j => j.OwnerId == userId).ToListAsync();
            return Ok(jobs);
        }

        [Authorize(Roles = "Homeowner")]
        [HttpPost]
        public async Task<IActionResult> PostJob(Job job)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (userIdClaim == null) return Unauthorized();
            job.OwnerId = int.Parse(userIdClaim);
            job.CreatedAt = DateTime.Now;
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        [Authorize(Roles = "Homeowner")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, Job updatedJob)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (job.OwnerId.ToString() != userIdClaim) return Forbid();

            // Cập nhật đầy đủ thông tin
            job.Title = updatedJob.Title;
            job.Description = updatedJob.Description;
            job.Salary = updatedJob.Salary;
            job.Location = updatedJob.Location;
            job.JobType = updatedJob.JobType;
            job.ServiceType = updatedJob.ServiceType;

            // Cập nhật các trường mới
            job.WorkingTime = updatedJob.WorkingTime;
            job.GenderReq = updatedJob.GenderReq;
            job.AgeReq = updatedJob.AgeReq;
            job.RequiredSkills = updatedJob.RequiredSkills;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công!" });
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            var userIdClaim = User.FindFirst("UserId")?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole != "Admin" && job.OwnerId.ToString() != userIdClaim) return Forbid();

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công!" });
        }
    }
}