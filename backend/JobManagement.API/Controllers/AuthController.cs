using JobManagement.API.Data;
using JobManagement.API.DTOs;
using JobManagement.API.Models;
using JobManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(
            ApplicationDbContext context,
            JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            // Admin accounts are created through the configured admin seeder,
            // never through public registration.
            if (request.Role == Role.ADMIN)
            {
                return BadRequest(new
                {
                    message = "Admin registration is not allowed."
                });
            }

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new
                {
                    message = "Username already exists"
                });
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new
                {
                    message = "Email already exists"
                });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully",
                user.Id,
                user.Username,
                user.Email,
                user.Role
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid username or password"
                });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new
                {
                    message = "Your account has been deactivated by admin."
                });
            }

            var passwordValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

            if (!passwordValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid username or password"
                });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Login successful",
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.Role
                }
            });
        }
    }
}