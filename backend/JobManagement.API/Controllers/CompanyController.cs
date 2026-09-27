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
    public class CompanyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CompanyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================
        // CREATE COMPANY
        // ============================
        [Authorize(Roles = "RECRUITER")]
        [HttpPost]
        public async Task<IActionResult> CreateCompany(Company company)
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            company.RecruiterId = recruiterId;
            company.Id = 0;
            company.CreatedAt = DateTime.UtcNow;

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return Ok(company);
        }

        // ============================
        // GET ALL COMPANIES
        // ============================
        [AllowAnonymous]
        [HttpGet]
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
                    Recruiter = c.Recruiter!.Username
                })
                .ToListAsync();

            return Ok(companies);
        }

        // ============================
        // GET MY COMPANIES
        // ============================
        [Authorize(Roles = "RECRUITER")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyCompanies()
        {
            var recruiterId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var companies = await _context.Companies
                .Include(c => c.Recruiter)
                .Where(c => c.RecruiterId == recruiterId)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.Location,
                    c.Website,
                    c.CreatedAt,
                    Recruiter = c.Recruiter!.Username
                })
                .ToListAsync();

            return Ok(companies);
        }

        // ============================
        // GET COMPANY BY ID
        // ============================
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            var company = await _context.Companies
                .Include(c => c.Recruiter)
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.Location,
                    c.Website,
                    c.CreatedAt,
                    Recruiter = c.Recruiter!.Username
                })
                .FirstOrDefaultAsync();

            if (company == null)
            {
                return NotFound(new
                {
                    message = "Company not found"
                });
            }

            return Ok(company);
        }
    }
}