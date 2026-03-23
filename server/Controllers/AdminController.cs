using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Services;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;

    public AdminController(ApplicationDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    // 1. QUẢN LÝ TÀI KHOẢN: Khóa/Mở khóa tài khoản
    [HttpPut("users/{userId}/lock")]
    public async Task<IActionResult> ToggleLockUser(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.IsLocked = !user.IsLocked;
        await _context.SaveChangesAsync();

        string status = user.IsLocked ? "bị khóa" : "đã được mở khóa";

        // Gửi thông báo cho User
        await _notificationService.SendNotification(
            userId,
            "Trạng thái tài khoản",
            $"Tài khoản của bạn {status} bởi Quản trị viên."
        );

        return Ok(new { message = $"Đã {status} tài khoản người dùng." });
    }

    // 2. QUẢN LÝ TIN ĐĂNG: Xóa tin vi phạm
    [HttpDelete("jobs/{jobId}")]
    public async Task<IActionResult> DeleteViolationJob(int jobId)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null) return NotFound();

        int ownerId = job.OwnerId;
        string title = job.Title;

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        // Gửi thông báo cho Chủ nhà
        await _notificationService.SendNotification(
            ownerId,
            "Tin đăng bị xóa",
            $"Tin '{title}' đã bị xóa do vi phạm quy định của hệ thống."
        );

        return Ok(new { message = "Đã xóa tin đăng vi phạm thành công." });
    }

    // 3. THEO DÕI HỆ THỐNG: Thống kê nhanh
   [HttpGet("stats")]
public async Task<IActionResult> GetStats()
{
    // 1. Thống kê số lượng người dùng (VIP và Thường)
    var totalUsers = await _context.Users.CountAsync();
    var premiumUsers = await _context.Users.CountAsync(u => u.IsPremium == true);
    var normalUsers = totalUsers - premiumUsers;

    // 2. Thống kê báo cáo và công việc
    var totalJobs = await _context.Jobs.CountAsync();
    var pendingReports = await _context.Reports.CountAsync(r => r.Status == "Pending");

    // 3. Tính tuổi trung bình từ bảng Profile
    var userProfiles = await _context.Users
        .Join(_context.Profiles, u => u.Id, p => p.UserId, (u, p) => new { u.Role, p.Age })
        .Where(x => x.Age > 0)
        .ToListAsync();

    double avgAgeHomeowner = userProfiles.Where(x => x.Role == "Homeowner").Select(x => x.Age).DefaultIfEmpty(0).Average();
    double avgAgeWorker = userProfiles.Where(x => x.Role == "Worker").Select(x => x.Age).DefaultIfEmpty(0).Average();

    // Tính % VIP
    double premiumPercentage = totalUsers > 0 ? (double)premiumUsers / totalUsers * 100 : 0;

    return Ok(new
    {
        totalUsers,
        premiumUsers,
        normalUsers,
        totalJobs,
        pendingReports,
        avgAgeHomeowner = Math.Round(avgAgeHomeowner, 1),
        avgAgeWorker = Math.Round(avgAgeWorker, 1),
        premiumPercentage = Math.Round(premiumPercentage, 1)
    });
}
    [HttpGet("reports-summary")]
    public async Task<IActionResult> GetReportsSummary()
    {
        var summary = await _context.Reports
            .GroupBy(r => r.TargetJobId)
            .Select(g => new
            {
                JobId = g.Key,
                ReportCount = g.Count(),
                JobTitle = _context.Jobs.Where(j => j.Id == g.Key).Select(j => j.Title).FirstOrDefault(),
                OwnerId = _context.Jobs.Where(j => j.Id == g.Key).Select(j => j.OwnerId).FirstOrDefault(),
                Details = g.Select(r => new { r.Reason, r.Description, r.CreatedAt }).ToList()
            })
            .OrderByDescending(x => x.ReportCount)
            .ToListAsync();

        return Ok(summary);
    }

    [HttpGet("users-by-role")]
    public async Task<IActionResult> GetUsersByRole([FromQuery] string role)
    {
        var users = await _context.Users
            .Where(u => u.Role == role)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();
        return Ok(users);
    }
}