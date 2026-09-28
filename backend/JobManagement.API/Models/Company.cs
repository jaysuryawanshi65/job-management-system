using System.ComponentModel.DataAnnotations;

namespace JobManagement.API.Models
{
    public class Company
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(150)]
        public string Website { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Recruiter who owns/manages this company
        public int RecruiterId { get; set; }

        public User? Recruiter { get; set; }
    }
}