using Microsoft.EntityFrameworkCore;
using server.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System.Text;
using server.Hubs;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// --- TỐI ƯU LẤY KEY JWT (Tránh lỗi 500 nếu thiếu config) ---
var jwtKey = builder.Configuration["Jwt:Key"] 
             ?? builder.Configuration["Jwt__Key"] 
             ?? "MinhTris25SecretKey_PhaiDaiTren32KyTu_123456"; // Key dự phòng
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "HomeHelperBackend",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "HomeHelperFrontend",
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddSignalR();
builder.Services.AddScoped<server.Services.INotificationService, server.Services.NotificationService>();
builder.Services.AddAuthorization();

// 1. Database - Sử dụng ConnectionString từ Azure
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                      ?? builder.Configuration["ConnectionStrings__DefaultConnection"];

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)); 

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. CORS - Thêm địa chỉ Azure vào nếu cần
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("https://home-helper-seven.vercel.app")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

var app = builder.Build();

// 3. Swagger luôn bật để bạn dễ dàng test trên Azure
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HomeHelper API V1");
    c.RoutePrefix = "swagger"; 
});

app.UseCors("AllowReactApp");
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
