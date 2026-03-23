using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ApplicationController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [Authorize(Roles = "Worker")]
        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] Application appRequest)
        {
            var workerIdClaim = User.FindFirst("UserId")?.Value;
            if (workerIdClaim == null) return Unauthorized();
            int workerId = int.Parse(workerIdClaim);

            var existingApp = await _context.Applications
                .FirstOrDefaultAsync(a => a.JobId == appRequest.JobId && a.WorkerId == workerId);

            if (existingApp != null)
                return BadRequest(new { message = "Bạn đã ứng tuyển công việc này rồi!" });

            var job = await _context.Jobs.FindAsync(appRequest.JobId);
            if (job == null) return NotFound();

            var newApp = new Application
            {
                JobId = appRequest.JobId,
                WorkerId = workerId,
                ApplyDate = DateTime.Now,
                Status = "Pending"
            };

            _context.Applications.Add(newApp);
            await _context.SaveChangesAsync();

            // 1. Thông báo cho Chủ nhà
            await _notificationService.SendNotification(
                job.OwnerId,
                "Ứng tuyển mới",
                $"Có ứng viên vừa ứng tuyển vào công việc: {job.Title}",
                $"/manage-jobs/{job.Id}"
            );

            // 2. Thông báo cho Người ứng tuyển
            await _notificationService.SendNotification(
                workerId,
                "Ứng tuyển thành công",
                $"Bạn đã gửi hồ sơ ứng tuyển cho: {job.Title}"
            );

            return Ok(new { message = "Ứng tuyển thành công!" });
        }

        [Authorize(Roles = "Homeowner")]
        [HttpPut("status/{appId}")]
        public async Task<IActionResult> UpdateStatus(int appId, [FromBody] string newStatus)
        {
            var app = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == appId);

            if (app == null) return NotFound();

            var currentUserId = User.FindFirst("UserId")?.Value;
            if (app.Job?.OwnerId.ToString() != currentUserId) return Forbid();

            app.Status = newStatus;
            await _context.SaveChangesAsync();

            // Thông báo cho Người giúp việc về kết quả
            string statusMsg = newStatus == "Accepted" ? "được CHẤP NHẬN" : "bị TỪ CHỐI";
            await _notificationService.SendNotification(
                app.WorkerId,
                "Kết quả ứng tuyển",
                $"Hồ sơ của bạn cho công việc '{app.Job?.Title}' đã {statusMsg}.",
                "/my-applications"
            );

            return Ok(new { message = $"Đã cập nhật trạng thái: {newStatus}" });
        }

        [Authorize(Roles = "Homeowner,Admin")]
        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetByJob(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null) return NotFound();

            var currentUserIdClaim = User.FindFirst("UserId")?.Value;
            if (currentUserIdClaim == null) return Unauthorized();
            int currentUserId = int.Parse(currentUserIdClaim);

            if (job.OwnerId != currentUserId && !User.IsInRole("Admin"))
                return Forbid();

            var owner = await _context.Users.FindAsync(currentUserId);
            bool isPremium = owner?.IsPremium ?? false;

            var applications = await _context.Applications
                .Where(a => a.JobId == jobId)
                .Join(_context.Users,
                      app => app.WorkerId,
                      user => user.Id,
                      (app, user) => new
                      {
                          app.Id,
                          app.ApplyDate,
                          app.Status,
                          WorkerName = user.FullName,
                          WorkerId = user.Id,
                          PhoneNumber = isPremium ? user.PhoneNumber : "********",
                          Email = isPremium ? user.Email : "Ẩn",
                          IsLocked = !isPremium
                      })
                .ToListAsync();

            return Ok(applications);
        }

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
                      (app, job) => new
                      {
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
    }
}