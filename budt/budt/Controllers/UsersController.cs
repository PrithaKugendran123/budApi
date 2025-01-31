using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using budt.Models;

namespace budt.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly budgetTrackerContext _context;

        public UsersController(budgetTrackerContext context)
        {
            _context = context;
        }
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetUserDashboard()
        {
            var userId = GetUserIdFromToken(); // Implement user authentication logic

            var totalIncome = await _context.Incomes
                .Where(i => i.UserId == userId)
                .SumAsync(i => i.Amount);

            var totalExpenses = await _context.Expenses
                .Where(e => e.Budget.UserId == userId)
                .SumAsync(e => e.Amount);

            var remainingBudget = totalIncome - totalExpenses;

            var upcomingTransactions = await _context.RecurringTransactions
                .Where(t => t.UserId == userId && t.StartDate >= DateTime.Now)
                .OrderBy(t => t.StartDate)
                .ToListAsync();

            var incomeTrend = new
            {
                labels = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" },
                data = new[] { 1000, 1200, 1500, 1800, 2000, 2500 } // Replace with actual data
            };

            var expenseTrend = new
            {
                labels = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" },
                data = new[] { 800, 1000, 1300, 1600, 1900, 2100 } // Replace with actual data
            };

            return Ok(new
            {
                totalIncome,
                totalExpenses,
                remainingBudget,
                upcomingTransactions,
                incomeTrend,
                expenseTrend
            });
        }

        private int GetUserIdFromToken()
        {
            // Implement logic to get the logged-in user's ID (JWT token decoding, session, etc.)
            return 1; // Replace with actual user authentication logic
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound(new { Message = "User data is unavailable." });
            }

            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound(new { Message = "User data is unavailable." });
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { Message = $"User with ID {id} not found." });
            }

            return Ok(user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.UserId)
            {
                return BadRequest(new { Message = "ID in the URL does not match the ID in the body." });
            }

            if (user == null)
            {
                return BadRequest(new { Message = "User data is required." });
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { Message = $"User with ID {id} not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'budgetTrackerContext.Users' is null.");
            }

            if (user == null || string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest(new { Message = "Invalid user data provided." });
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound(new { Message = "User data is unavailable." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = $"User with ID {id} not found." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = $"User with ID {id} deleted successfully." });
        }

        private bool UserExists(int id)
        {
            return _context.Users?.Any(e => e.UserId == id) ?? false;
        }
    }
}
