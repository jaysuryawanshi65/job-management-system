using JobManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================
        // GET ALL USERS
        // ============================
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.CreatedAt,
                    u.IsActive
                })
                .ToListAsync();

            return Ok(users);
        }

        // ============================
        // ============================
        // ACTIVATE / DEACTIVATE USER
        // ============================

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(
            int id,
            [FromBody] bool isActive)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            // Admin cannot be deactivated,
            // but an already deactivated admin can be activated again.
            if (user.Role == JobManagement.API.Models.Role.ADMIN && !isActive)
            {
                return BadRequest(new
                {
                    message = "Admin users cannot be deactivated."
                });
            }

            user.IsActive = isActive;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = isActive
                    ? "User activated successfully."
                    : "User deactivated successfully.",
                user.Id,
                user.Username,
                user.IsActive
            });
        }
        // ============================
        // GET ALL COMPANIES
        // ============================
        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _context.Companies
                .Include(c => c.Recruiter)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.Location,
                    c.Website,
                    c.CreatedAt,

                    RecruiterId = c.RecruiterId,
                    Recruiter = c.Recruiter!.Username
                })
                .ToListAsync();

            return Ok(companies);
        }

        // ============================
        // GET ALL JOBS
        // ============================
        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Company)
                .Include(j => j.Recruiter)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Description,
                    j.Location,
                    j.EmploymentType,
                    j.ExperienceLevel,
                    j.SalaryRange,
                    j.IsActive,
                    j.CreatedAt,

                    CompanyId = j.CompanyId,
                    Company = j.Company!.Name,

                    RecruiterId = j.RecruiterId,
                    Recruiter = j.Recruiter!.Username
                })
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs);
        }

        // ============================
        // GET ALL APPLICATIONS
        // ============================
        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications()
        {
            var applications = await _context.JobApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j!.Company)
                .Include(a => a.JobSeeker)
                .Select(a => new
                {
                    a.Id,
                    a.CoverLetter,
                    a.Status,
                    a.AppliedAt,

                    JobId = a.JobId,
                    Job = a.Job!.Title,

                    CompanyId = a.Job!.CompanyId,
                    Company = a.Job!.Company!.Name,

                    JobSeekerId = a.JobSeekerId,
                    JobSeeker = a.JobSeeker!.Username,
                    Email = a.JobSeeker!.Email
                })
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(applications);
        }
    }
}