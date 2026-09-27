using System.ComponentModel.DataAnnotations;

namespace JobManagement.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public Role Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // Resume Information
        [MaxLength(255)]
        public string? ResumeFileName { get; set; }

        [MaxLength(500)]
        public string? ResumePath { get; set; }
    }
}