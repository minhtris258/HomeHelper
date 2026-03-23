using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ReportController(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [Authorize(Roles = "Worker")]
        [HttpPost]
        public async Task<IActionResult> SendReport([FromBody] ReportCreateDto reportDto)
        {
            var reporterIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(reporterIdClaim)) return Unauthorized();
            int reporterId = int.Parse(reporterIdClaim);

            var jobExists = await _context.Jobs.AnyAsync(j => j.Id == reportDto.TargetJobId);
            if (!jobExists) return NotFound(new { message = "Công việc không tồn tại." });

            var newReport = new Report
            {
                ReporterId = reporterId,
                TargetJobId = reportDto.TargetJobId,
                Reason = reportDto.Reason,
                Description = reportDto.Description,
                CreatedAt = DateTime.Now,
                Status = "Pending"
            };

            _context.Reports.Add(newReport);
            await _context.SaveChangesAsync();

            // Thông báo cho tất cả Admin
            var admins = await _context.Users.Where(u => u.Role == "Admin").ToListAsync();
            foreach (var admin in admins)
            {
                await _notificationService.SendNotification(admin.Id, "Tố cáo mới", "Có một bài đăng vừa bị báo cáo vi phạm.");
            }

            return Ok(new { message = "Gửi tố cáo thành công." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("warn-job/{jobId}")]
        public async Task<IActionResult> WarnJob(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null) return NotFound();

            var reports = await _context.Reports.Where(r => r.TargetJobId == jobId).ToListAsync();
            foreach (var report in reports)
            {
                report.Status = "Warned";
            }
            await _context.SaveChangesAsync();

            // Thông báo cảnh báo cho Chủ nhà
            await _notificationService.SendNotification(
                job.OwnerId, 
                "Cảnh báo từ hệ thống", 
                $"Tin đăng '{job.Title}' của bạn nhận được báo cáo vi phạm. Vui lòng kiểm tra lại nội dung."
            );

            return Ok(new { message = "Đã gửi nhắc nhở cho nhà tuyển dụng." });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllReports()
        {
            var reports = await _context.Reports
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Reason,
                    r.Description,
                    r.Status,
                    r.CreatedAt,
                    r.TargetJobId,
                    ReporterName = _context.Users.Where(u => u.Id == r.ReporterId).Select(u => u.FullName).FirstOrDefault(),
                    JobTitle = _context.Jobs.Where(j => j.Id == r.TargetJobId).Select(j => j.Title).FirstOrDefault(),
                    OwnerId = _context.Jobs.Where(j => j.Id == r.TargetJobId).Select(j => j.OwnerId).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(reports);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateReportStatus(int id, [FromBody] string status)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null) return NotFound();

            report.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã cập nhật trạng thái tố cáo." });
        }
    }

    public class ReportCreateDto
    {
        public int TargetJobId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}