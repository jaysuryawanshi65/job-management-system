using System.Security.Claims;
using JobManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "RECRUITER")]
    public class RecruiterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecruiterController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Recruiter Dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var totalCompanies = await _context.Companies
                .CountAsync(c => c.RecruiterId == recruiterId);

            var totalJobs = await _context.Jobs
                .CountAsync(j => j.RecruiterId == recruiterId);

            var totalApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.Job!.RecruiterId == recruiterId);

            var shortlistedApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.Job!.RecruiterId == recruiterId &&
                    a.Status == "SHORTLISTED");

            var hiredApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.Job!.RecruiterId == recruiterId &&
                    a.Status == "HIRED");

            return Ok(new
            {
                totalCompanies,
                totalJobs,
                totalApplications,
                shortlistedApplications,
                hiredApplications
            });
        }

        // Recruiter's Jobs
        [HttpGet("jobs")]
        public async Task<IActionResult> GetMyJobs()
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var jobs = await _context.Jobs
                .Include(j => j.Company)
                .Where(j => j.RecruiterId == recruiterId)
                .OrderByDescending(j => j.CreatedAt)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Location,
                    j.EmploymentType,
                    j.ExperienceLevel,
                    j.SalaryRange,
                    j.IsActive,
                    j.CreatedAt,
                    Company = j.Company!.Name
                })
                .ToListAsync();

            return Ok(jobs);
        }
    }
}