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
    public class ExpensesController : ControllerBase
    {
        private readonly budgetTrackerContext _context;

        public ExpensesController(budgetTrackerContext context)
        {
            _context = context;
        }

        // Dashboard endpoint to fetch total expenses and expense trend for a specific user
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetExpensesForDashboard()
        {
            var userId = GetUserIdFromToken(); // Replace with actual authentication logic

            if (_context.Expenses == null)
            {
                return NotFound();
            }

            // Calculate total expenses for the logged-in user
            var totalExpenses = await _context.Expenses
                .Where(e => e.Budget.UserId == userId)
                .SumAsync(e => e.Amount);

            // Expense trend (example for the last 6 months)
            var expenseTrend = await _context.Expenses
                .Where(e => e.Budget.UserId == userId)
                .GroupBy(e => new { e.Date.Year, e.Date.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Label = $"{g.Key.Year}-{g.Key.Month}",
                    Amount = g.Sum(e => e.Amount)
                }).ToListAsync();

            return Ok(new
            {
                totalExpenses,
                expenseTrend
            });
        }

        // Dummy function for user authentication (replace with actual implementation)
        private int GetUserIdFromToken()
        {
            // Replace with your authentication logic to extract the user's ID from the token.
            return 1; // For now, returning a dummy user ID
        }

        // GET: api/Expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetExpenses()
        {
            if (_context.Expenses == null)
            {
                return NotFound();
            }

            var expenses = await _context.Expenses
                .Include(e => e.Budget) // Ensure Budget is included
                .Where(e => e.Budget.UserId == GetUserIdFromToken()) // Filter by logged-in user
                .Select(e => new
                {
                    e.ExpenseId,
                    e.BudgetId,
                    e.Amount,
                    e.Date,
                    e.Notes,
                    e.CreatedAt,
                    Category = e.Budget != null ? e.Budget.CategoryName : "Uncategorized" // Extract category name
                })
                .ToListAsync();

            return Ok(expenses);
        }

        // GET: api/Expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(int id)
        {
            if (_context.Expenses == null)
            {
                return NotFound();
            }

            var expense = await _context.Expenses.FindAsync(id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
        }

        // PUT: api/Expenses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense(int id, Expense expense)
        {
            if (id != expense.ExpenseId)
            {
                return BadRequest("Expense ID mismatch.");
            }

            // Check if the expense exists first
            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null)
            {
                return NotFound($"Expense with ID {id} not found.");
            }

            // Manually update only the fields you want to change
            existingExpense.Amount = expense.Amount;
            existingExpense.Date = expense.Date;
            existingExpense.Notes = expense.Notes;
            existingExpense.BudgetId = expense.BudgetId;

            // If you want to update CreatedAt, ensure you are okay with that:
            existingExpense.CreatedAt = existingExpense.CreatedAt ?? DateTime.UtcNow;

            _context.Entry(existingExpense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseExists(id))
                {
                    return NotFound($"Expense with ID {id} no longer exists.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Expenses
        // POST: api/Expenses
        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(ExpenseCreateDTO expenseDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_context.Expenses == null)
            {
                return Problem("Entity set 'budgetTrackerContext.Expenses' is null.");
            }

            // Find the Budget using CategoryName
            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.CategoryName == expenseDTO.CategoryName && b.UserId == GetUserIdFromToken());

            if (budget == null)
            {
                return BadRequest("Invalid category name or unauthorized access.");
            }

            // Create a new Expense from the DTO
            var expense = new Expense
            {
                BudgetId = budget.BudgetId,
                Amount = expenseDTO.Amount,
                Date = expenseDTO.Date,
                Notes = expenseDTO.Notes,
                CreatedAt = DateTime.UtcNow // Set the CreatedAt timestamp
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpense", new { id = expense.ExpenseId }, expense);
        }


        // DELETE: api/Expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound($"Expense with ID {id} not found.");
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExpenseExists(int id)
        {
            return (_context.Expenses?.Any(e => e.ExpenseId == id)).GetValueOrDefault();
        }
    }
}
