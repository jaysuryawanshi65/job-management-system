using System.Security.Claims;
using JobManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "JOB_SEEKER")]
    public class JobSeekerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobSeekerController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var jobSeekerId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var totalApplications = await _context.JobApplications
                .CountAsync(a => a.JobSeekerId == jobSeekerId);

            var appliedApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.JobSeekerId == jobSeekerId &&
                    a.Status == "APPLIED");

            var shortlistedApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.JobSeekerId == jobSeekerId &&
                    a.Status == "SHORTLISTED");

            var interviewApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.JobSeekerId == jobSeekerId &&
                    a.Status == "INTERVIEW");

            var hiredApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.JobSeekerId == jobSeekerId &&
                    a.Status == "HIRED");

            var rejectedApplications = await _context.JobApplications
                .CountAsync(a =>
                    a.JobSeekerId == jobSeekerId &&
                    a.Status == "REJECTED");

            return Ok(new
            {
                totalApplications,
                appliedApplications,
                shortlistedApplications,
                interviewApplications,
                hiredApplications,
                rejectedApplications
            });
        }
    }
}