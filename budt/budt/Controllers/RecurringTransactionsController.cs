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
    public class RecurringTransactionsController : ControllerBase
    {
        private readonly budgetTrackerContext _context;

        public RecurringTransactionsController(budgetTrackerContext context)
        {
            _context = context;
        }

        // GET: api/RecurringTransactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecurringTransaction>>> GetRecurringTransactions()
        {
          if (_context.RecurringTransactions == null)
          {
              return NotFound();
          }
            return await _context.RecurringTransactions.ToListAsync();
        }

        // GET: api/RecurringTransactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecurringTransaction>> GetRecurringTransaction(int id)
        {
          if (_context.RecurringTransactions == null)
          {
              return NotFound();
          }
            var recurringTransaction = await _context.RecurringTransactions.FindAsync(id);

            if (recurringTransaction == null)
            {
                return NotFound();
            }

            return recurringTransaction;
        }

        // PUT: api/RecurringTransactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecurringTransaction(int id, RecurringTransaction recurringTransaction)
        {
            if (id != recurringTransaction.TransactionId)
            {
                return BadRequest();
            }

            _context.Entry(recurringTransaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecurringTransactionExists(id))
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

        // POST: api/RecurringTransactions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RecurringTransaction>> PostRecurringTransaction(RecurringTransaction recurringTransaction)
        {
          if (_context.RecurringTransactions == null)
          {
              return Problem("Entity set 'budgetTrackerContext.RecurringTransactions'  is null.");
          }
            _context.RecurringTransactions.Add(recurringTransaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecurringTransaction", new { id = recurringTransaction.TransactionId }, recurringTransaction);
        }

        // DELETE: api/RecurringTransactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecurringTransaction(int id)
        {
            if (_context.RecurringTransactions == null)
            {
                return NotFound();
            }
            var recurringTransaction = await _context.RecurringTransactions.FindAsync(id);
            if (recurringTransaction == null)
            {
                return NotFound();
            }

            _context.RecurringTransactions.Remove(recurringTransaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RecurringTransactionExists(int id)
        {
            return (_context.RecurringTransactions?.Any(e => e.TransactionId == id)).GetValueOrDefault();
        }
    }
}
