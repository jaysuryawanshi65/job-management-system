using System.Security.Claims;
using JobManagement.API.Data;
using JobManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "JOB_SEEKER")]
        [HttpPost]
        public async Task<IActionResult> ApplyForJob(JobApplication application)
        {
            var jobSeekerId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var jobExists = await _context.Jobs
                .AnyAsync(j => j.Id == application.JobId && j.IsActive);

            if (!jobExists)
            {
                return BadRequest(new
                {
                    message = "Job not found or is no longer active."
                });
            }

            var alreadyApplied = await _context.JobApplications
                .AnyAsync(a =>
                    a.JobId == application.JobId &&
                    a.JobSeekerId == jobSeekerId
                );

            if (alreadyApplied)
            {
                return BadRequest(new
                {
                    message = "You have already applied for this job."
                });
            }

            application.Id = 0;
            application.JobSeekerId = jobSeekerId;
            application.Status = "APPLIED";
            application.AppliedAt = DateTime.UtcNow;

            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(application);
        }

        [Authorize(Roles = "JOB_SEEKER")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyApplications()
        {
            var jobSeekerId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var applications = await _context.JobApplications
                .Include(a => a.Job)
                .ThenInclude(j => j!.Company)
                .Where(a => a.JobSeekerId == jobSeekerId)
                .Select(a => new
                {
                    a.Id,
                    a.Status,
                    a.CoverLetter,
                    a.AppliedAt,
                    Job = a.Job!.Title,
                    Company = a.Job.Company!.Name
                })
                .ToListAsync();

            return Ok(applications);
        }

        [Authorize(Roles = "RECRUITER")]
        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId)
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j =>
                    j.Id == jobId &&
                    j.RecruiterId == recruiterId
                );

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Job not found or you are not the owner."
                });
            }

            var applications = await _context.JobApplications
                .Include(a => a.JobSeeker)
                .Where(a => a.JobId == jobId)
                .Select(a => new
                {
                    a.Id,
                    a.Status,
                    a.CoverLetter,
                    a.AppliedAt,
                    JobSeeker = a.JobSeeker!.Username,
                    Email = a.JobSeeker.Email
                })
                .ToListAsync();

            return Ok(applications);
        }

        [Authorize(Roles = "RECRUITER")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(
            int id,
            [FromBody] string status)
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var application = await _context.JobApplications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a =>
                    a.Id == id &&
                    a.Job!.RecruiterId == recruiterId
                );

            if (application == null)
            {
                return NotFound(new
                {
                    message = "Application not found or you are not authorized."
                });
            }

            var allowedStatuses = new[]
            {
                "APPLIED",
                "SHORTLISTED",
                "REJECTED",
                "INTERVIEW",
                "HIRED"
            };

            if (string.IsNullOrWhiteSpace(status))
            {
                return BadRequest(new
                {
                    message = "Application status is required."
                });
            }

            var normalizedStatus = status.Trim().ToUpperInvariant();

            if (!allowedStatuses.Contains(normalizedStatus))
            {
                return BadRequest(new
                {
                    message = "Invalid application status."
                });
            }

            application.Status = normalizedStatus;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Application status updated successfully",
                application.Id,
                application.Status
            });
        }
    }
}