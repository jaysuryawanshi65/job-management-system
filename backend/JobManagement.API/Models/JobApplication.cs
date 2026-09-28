using System.ComponentModel.DataAnnotations;

namespace JobManagement.API.Models
{
    public class JobApplication
    {
        public int Id { get; set; }

        [MaxLength(1000)]
        public string CoverLetter { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Status { get; set; } = "APPLIED";

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        // Job being applied for
        public int JobId { get; set; }

        public Job? Job { get; set; }

        // Job seeker who applied
        public int JobSeekerId { get; set; }

        public User? JobSeeker { get; set; }
    }
}