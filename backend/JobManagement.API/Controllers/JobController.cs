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
    public class JobController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobController(ApplicationDbContext context)
        {
            _context = context;
        }

        // CREATE JOB
        [Authorize(Roles = "RECRUITER")]
        [HttpPost]
        public async Task<IActionResult> CreateJob(Job job)
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var company = await _context.Companies
                .FirstOrDefaultAsync(c =>
                    c.Id == job.CompanyId &&
                    c.RecruiterId == recruiterId
                );

            if (company == null)
            {
                return BadRequest(new
                {
                    message = "Company not found or you are not the owner of this company."
                });
            }

            job.Id = 0;
            job.RecruiterId = recruiterId;
            job.CreatedAt = DateTime.UtcNow;
            job.IsActive = true;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return Ok(job);
        }

        // GET ALL ACTIVE JOBS
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetJobs(
            string? keyword,
            string? location,
            string? employmentType,
            string? experienceLevel)
        {
            var query = _context.Jobs
                .Include(j => j.Company)
                .Where(j => j.IsActive)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(j =>
                    j.Title.Contains(keyword) ||
                    j.Description.Contains(keyword));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(j =>
                    j.Location.Contains(location));
            }

            if (!string.IsNullOrWhiteSpace(employmentType))
            {
                query = query.Where(j =>
                    j.EmploymentType == employmentType);
            }

            if (!string.IsNullOrWhiteSpace(experienceLevel))
            {
                query = query.Where(j =>
                    j.ExperienceLevel == experienceLevel);
            }

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
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
                    Company = j.Company!.Name
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // GET JOB BY ID
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company)
                .Where(j => j.Id == id && j.IsActive)
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
                    Company = j.Company!.Name
                })
                .FirstOrDefaultAsync();

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Job not found"
                });
            }

            return Ok(job);
        }

        // UPDATE JOB
        [Authorize(Roles = "RECRUITER")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(
            int id,
            Job updatedJob)
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j =>
                    j.Id == id &&
                    j.RecruiterId == recruiterId);

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Job not found or you are not authorized."
                });
            }

            var company = await _context.Companies
                .FirstOrDefaultAsync(c =>
                    c.Id == updatedJob.CompanyId &&
                    c.RecruiterId == recruiterId);

            if (company == null)
            {
                return BadRequest(new
                {
                    message = "Company not found or you are not the owner."
                });
            }

            job.Title = updatedJob.Title;
            job.Description = updatedJob.Description;
            job.Location = updatedJob.Location;
            job.EmploymentType = updatedJob.EmploymentType;
            job.ExperienceLevel = updatedJob.ExperienceLevel;
            job.SalaryRange = updatedJob.SalaryRange;
            job.CompanyId = updatedJob.CompanyId;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Job updated successfully",
                job
            });
        }

        // DEACTIVATE JOB
        [Authorize(Roles = "RECRUITER")]
        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivateJob(int id)
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var job = await _context.Jobs
                .FirstOrDefaultAsync(j =>
                    j.Id == id &&
                    j.RecruiterId == recruiterId);

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Job not found or you are not authorized."
                });
            }

            job.IsActive = false;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Job deactivated successfully",
                job.Id,
                job.IsActive
            });
        }
    }
}