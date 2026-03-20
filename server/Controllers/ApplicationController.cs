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
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ApplicationController(ApplicationDbContext context) { _context = context; }

        // 1. NGƯỜI GIÚP VIỆC ỨNG TUYỂN (Chỉ dành cho Worker)
        [Authorize(Roles = "Worker")]
        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] Application appRequest)
        {
            // Lấy WorkerId từ Token để đảm bảo không ai ứng tuyển hộ người khác
            var workerIdClaim = User.FindFirst("UserId")?.Value;
            if (workerIdClaim == null) return Unauthorized();
            int workerId = int.Parse(workerIdClaim);

            // Kiểm tra xem đã ứng tuyển vào Job này chưa (Tránh spam)
            var existingApp = await _context.Applications
                .FirstOrDefaultAsync(a => a.JobId == appRequest.JobId && a.WorkerId == workerId);
            
            if (existingApp != null)
                return BadRequest(new { message = "Bạn đã ứng tuyển công việc này rồi!" });

            // Tạo mới đơn ứng tuyển
            var newApp = new Application
            {
                JobId = appRequest.JobId,
                WorkerId = workerId,
                ApplyDate = DateTime.Now,
                Status = "Pending"
            };

            _context.Applications.Add(newApp);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ứng tuyển thành công! Chủ nhà sẽ sớm xem hồ sơ của bạn." });
        }

        // 2. CHỦ NHÀ XEM DANH SÁCH ỨNG VIÊN (Của một Job cụ thể)
        [Authorize(Roles = "Homeowner,Admin")]
        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetByJob(int jobId)
        {
            // Kiểm tra xem Job này có phải của chủ nhà đang đăng nhập không
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null) return NotFound();

            var currentUserId = User.FindFirst("UserId")?.Value;
            if (job.OwnerId.ToString() != currentUserId && !User.IsInRole("Admin"))
                return Forbid();

            // Lấy danh sách ứng tuyển kèm thông tin cơ bản của Worker
            var applications = await _context.Applications
                .Where(a => a.JobId == jobId)
                .Join(_context.Users, 
                      app => app.WorkerId, 
                      user => user.Id, 
                      (app, user) => new { 
                          app.Id, 
                          app.ApplyDate, 
                          app.Status, 
                          WorkerName = user.FullName,
                          WorkerId = user.Id
                      })
                .ToListAsync();

            return Ok(applications);
        }

        // 3. NGƯỜI GIÚP VIỆC XEM CÁC CÔNG VIỆC MÌNH ĐÃ ỨNG TUYỂN
        [Authorize(Roles = "Worker")]
        [HttpGet("my-applications")]
        public async Task<IActionResult> GetMyApplications()
        {
            var workerId = int.Parse(User.FindFirst("UserId")?.Value!);
            
            var myApps = await _context.Applications
                .Where(a => a.WorkerId == workerId)
                .Join(_context.Jobs, 
                      app => app.JobId, 
                      job => job.Id, 
                      (app, job) => new { 
                          app.Id, 
                          app.Status, 
                          app.ApplyDate, 
                          JobTitle = job.Title,
                          job.Location,
                          job.Salary
                      })
                .ToListAsync();

            return Ok(myApps);
        }

        // 4. CHỦ NHÀ DUYỆT/TỪ CHỐI ỨNG VIÊN
        [Authorize(Roles = "Homeowner")]
        [HttpPut("status/{appId}")]
        public async Task<IActionResult> UpdateStatus(int appId, [FromBody] string newStatus)
        {
            var app = await _context.Applications.FindAsync(appId);
            if (app == null) return NotFound();

            // Kiểm tra quyền (Chủ nhà của Job đó mới được duyệt)
            var job = await _context.Jobs.FindAsync(app.JobId);
            var currentUserId = User.FindFirst("UserId")?.Value;
            if (job?.OwnerId.ToString() != currentUserId) return Forbid();

            app.Status = newStatus; // Accepted, Rejected...
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã cập nhật trạng thái đơn ứng tuyển thành: {newStatus}" });
        }
    }
}