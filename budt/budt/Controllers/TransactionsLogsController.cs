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
    public class TransactionsLogsController : ControllerBase
    {
        private readonly budgetTrackerContext _context;

        public TransactionsLogsController(budgetTrackerContext context)
        {
            _context = context;
        }

        // GET: api/TransactionsLogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionsLog>>> GetTransactionsLogs()
        {
          if (_context.TransactionsLogs == null)
          {
              return NotFound();
          }
            return await _context.TransactionsLogs.ToListAsync();
        }
        [HttpGet("transactions-by-month")]
        public async Task<ActionResult<IEnumerable<TransactionsLog>>> GetMonthlyTransactions([FromQuery] int month, [FromQuery] int year)
        {
            Console.WriteLine($"Received request for month: {month}, year: {year}");

            if (_context.TransactionsLogs == null)
            {
                Console.WriteLine("Database context is null.");
                return NotFound();
            }

            var transactions = await _context.TransactionsLogs
                .Where(t => t.Date.Month == month && t.Date.Year == year)
                .ToListAsync();

            if (transactions.Count == 0)
            {
                Console.WriteLine("No transactions found.");
            }

            return Ok(transactions);
        }

        // GET: api/TransactionsLogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionsLog>> GetTransactionsLog(int id)
        {
          if (_context.TransactionsLogs == null)
          {
              return NotFound();
          }
            var transactionsLog = await _context.TransactionsLogs.FindAsync(id);

            if (transactionsLog == null)
            {
                return NotFound();
            }

            return transactionsLog;
        }

        // PUT: api/TransactionsLogs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransactionsLog(int id, TransactionsLog transactionsLog)
        {
            if (id != transactionsLog.LogId)
            {
                return BadRequest();
            }

            _context.Entry(transactionsLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionsLogExists(id))
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

        // POST: api/TransactionsLogs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TransactionsLog>> PostTransactionsLog(TransactionsLog transactionsLog)
        {
          if (_context.TransactionsLogs == null)
          {
              return Problem("Entity set 'budgetTrackerContext.TransactionsLogs'  is null.");
          }
            _context.TransactionsLogs.Add(transactionsLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransactionsLog", new { id = transactionsLog.LogId }, transactionsLog);
        }

        // DELETE: api/TransactionsLogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransactionsLog(int id)
        {
            if (_context.TransactionsLogs == null)
            {
                return NotFound();
            }
            var transactionsLog = await _context.TransactionsLogs.FindAsync(id);
            if (transactionsLog == null)
            {
                return NotFound();
            }

            _context.TransactionsLogs.Remove(transactionsLog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionsLogExists(int id)
        {
            return (_context.TransactionsLogs?.Any(e => e.LogId == id)).GetValueOrDefault();
        }
    }
}
