using System.ComponentModel.DataAnnotations;

namespace JobManagement.API.Models
{
    public class Job
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(100)]
        public string EmploymentType { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ExperienceLevel { get; set; } = string.Empty;

        [MaxLength(100)]
        public string SalaryRange { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Company that posted the job
        public int CompanyId { get; set; }

        public Company? Company { get; set; }

        // Recruiter who posted the job
        public int RecruiterId { get; set; }

        public User? Recruiter { get; set; }
    }
}