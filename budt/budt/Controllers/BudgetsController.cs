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
    public class BudgetsController : ControllerBase
    {
        private readonly budgetTrackerContext _context;

        public BudgetsController(budgetTrackerContext context)
        {
            _context = context;
        }

        // GET: api/Budgets (For all budgets)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgets()
        {
            if (_context.Budgets == null)
            {
                return NotFound();
            }
            return await _context.Budgets.ToListAsync();
        }

        // GET: api/Budgets/MGet (For all budgets with spending progress)
        [HttpGet("MGet")]
        public async Task<ActionResult<IEnumerable<object>>> GetMBudgets()
        {
            var budgets = await _context.Budgets
                .Include(b => b.Expenses)
                .Select(b => new
                {
                    b.BudgetId,
                    b.CategoryName,
                    b.BudgetAmount,
                    SpentAmount = b.Expenses.Sum(e => e.Amount),
                    RemainingAmount = b.BudgetAmount - b.Expenses.Sum(e => e.Amount),
                    IsExceeded = b.BudgetAmount < b.Expenses.Sum(e => e.Amount)
                })
                .ToListAsync();

            return Ok(budgets);
        }

        // POST: api/Budgets (Create a new budget)
        [HttpPost]
        public async Task<ActionResult<Budget>> PostBudget(Budget budget)
        {
            if (_context.Budgets == null)
            {
                return Problem("Entity set 'budgetTrackerContext.Budgets' is null.");
            }

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            // Return a 201 Created response with the created budget
            return Created($"/api/Budgets/{budget.BudgetId}", budget);
        }

        // GET: api/Budgets/MonthData?month=2025-01
        [HttpGet("MonthData")]
        public async Task<ActionResult<object>> GetBudgetDataForMonth([FromQuery] string month)
        {
            var monthStart = DateTime.Parse($"{month}-01");
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var budgetData = await _context.Budgets
                .Include(b => b.Expenses)
                .Where(b => b.CreatedAt >= monthStart && b.CreatedAt <= monthEnd)
                .Select(b => new
                {
                    b.CategoryName,
                    TotalBudget = b.BudgetAmount,
                    SpentAmount = b.Expenses.Where(e => e.Date >= monthStart && e.Date <= monthEnd).Sum(e => e.Amount),
                    RemainingAmount = b.BudgetAmount - b.Expenses.Where(e => e.Date >= monthStart && e.Date <= monthEnd).Sum(e => e.Amount),
                    IsExceeded = b.BudgetAmount < b.Expenses.Where(e => e.Date >= monthStart && e.Date <= monthEnd).Sum(e => e.Amount)
                })
                .ToListAsync();

            return Ok(budgetData);
        }

        // PUT: api/Budgets/5 (Update an existing budget by ID)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget(int id, Budget budget)
        {
            if (id != budget.BudgetId)
            {
                return BadRequest();
            }

            _context.Entry(budget).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Budgets/5 (Delete a specific budget by ID)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            if (_context.Budgets == null)
            {
                return NotFound();
            }

            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound();
            }

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BudgetExists(int id)
        {
            return (_context.Budgets?.Any(e => e.BudgetId == id)).GetValueOrDefault();
        }
    }
}
