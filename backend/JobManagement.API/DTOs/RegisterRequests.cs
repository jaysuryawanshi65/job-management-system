using System.ComponentModel.DataAnnotations;
using JobManagement.API.Models;

namespace JobManagement.API.DTOs
{
    public class RegisterRequest
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public Role Role { get; set; }
    }
}