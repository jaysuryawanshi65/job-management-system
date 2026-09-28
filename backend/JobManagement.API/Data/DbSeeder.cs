using JobManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminAsync(
            IServiceProvider services,
            IConfiguration configuration)
        {
            var username = configuration["Admin:Username"];
            var email = configuration["Admin:Email"];
            var password = configuration["Admin:Password"];

            // Admin seeding is optional. If these settings are not supplied,
            // startup continues without creating an admin.
            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                return;
            }

            if (password.Length < 6)
            {
                throw new InvalidOperationException(
                    "Admin:Password must be at least 6 characters long.");
            }

            var context = services.GetRequiredService<ApplicationDbContext>();

            var adminExists = await context.Users.AnyAsync(
                u => u.Role == Role.ADMIN);

            if (adminExists)
            {
                return;
            }

            var usernameExists = await context.Users.AnyAsync(
                u => u.Username == username);

            if (usernameExists)
            {
                throw new InvalidOperationException(
                    $"Admin username '{username}' is already used by another account.");
            }

            var emailExists = await context.Users.AnyAsync(
                u => u.Email == email);

            if (emailExists)
            {
                throw new InvalidOperationException(
                    $"Admin email '{email}' is already used by another account.");
            }

            var admin = new User
            {
                Username = username.Trim(),
                Email = email.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = Role.ADMIN,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}
