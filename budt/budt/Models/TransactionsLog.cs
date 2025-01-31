using System;
using System.Collections.Generic;

namespace budt.Models
{
    public partial class TransactionsLog
    {
        public int LogId { get; set; }
        public int? UserId { get; set; }
        public string TransactionType { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual User? User { get; set; }
    }
}
