using System.Security.Claims;
using JobManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ResumeController(
            ApplicationDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // =========================================
        // UPLOAD RESUME - JOB SEEKER
        // =========================================

        [Authorize(Roles = "JOB_SEEKER")]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    message = "Please select a resume file."
                });
            }

            var allowedExtensions = new[]
            {
                ".pdf",
                ".doc",
                ".docx"
            };

            var extension = Path.GetExtension(file.FileName)
                .ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new
                {
                    message = "Only PDF, DOC and DOCX files are allowed."
                });
            }

            const long maxFileSize = 5 * 1024 * 1024;

            if (file.Length > maxFileSize)
            {
                return BadRequest(new
                {
                    message = "Resume size must be less than 5 MB."
                });
            }

            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            var uploadsFolder = Path.Combine(
                _environment.ContentRootPath,
                "Uploads",
                "Resumes"
            );

            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName =
                $"{userId}_{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                uploadsFolder,
                uniqueFileName
            );

            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.ResumeFileName = file.FileName;

            user.ResumePath = Path.Combine(
                "Uploads",
                "Resumes",
                uniqueFileName
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Resume uploaded successfully.",
                fileName = user.ResumeFileName
            });
        }

        // =========================================
        // VIEW / DOWNLOAD APPLICANT RESUME
        // =========================================

        [Authorize(Roles = "RECRUITER,ADMIN")]
        [HttpGet("application/{applicationId}")]
        public async Task<IActionResult> GetApplicantResume(
            int applicationId)
        {
            var application = await _context.JobApplications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
            {
                return NotFound(new
                {
                    message = "Application not found."
                });
            }

            var currentUserId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var currentUserRole =
                User.FindFirstValue(ClaimTypes.Role);

            // =========================================
            // RECRUITER OWNERSHIP CHECK
            // =========================================

            if (currentUserRole == "RECRUITER")
            {
                if (application.Job == null ||
                    application.Job.RecruiterId != currentUserId)
                {
                    return Forbid();
                }
            }

            // =========================================
            // GET JOB SEEKER
            // =========================================

            var jobSeeker = await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == application.JobSeekerId
                );

            if (jobSeeker == null)
            {
                return NotFound(new
                {
                    message = "Job seeker not found."
                });
            }

            if (string.IsNullOrWhiteSpace(
                jobSeeker.ResumePath))
            {
                return NotFound(new
                {
                    message = "Resume not uploaded by this job seeker."
                });
            }

            var filePath = Path.Combine(
                _environment.ContentRootPath,
                jobSeeker.ResumePath
            );

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new
                {
                    message = "Resume file not found."
                });
            }

            var extension = Path
                .GetExtension(jobSeeker.ResumeFileName ?? "")
                .ToLowerInvariant();

            var contentType = extension switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" =>
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream"
            };

            var fileBytes = await System.IO.File.ReadAllBytesAsync(
                filePath
            );

            return File(
                fileBytes,
                contentType,
                jobSeeker.ResumeFileName
            );
        }
    }
}