namespace server.Models
{
    public class Application
    {
        public int Id { get; set; }
        public int JobId { get; set; } // Ứng tuyển vào tin nào
        public int WorkerId { get; set; } // Ai ứng tuyển
        public DateTime ApplyDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected
    }
}