using System;
using System.Collections.Generic;

namespace budt.Models
{
    public partial class RecurringTransaction
    {
        public int TransactionId { get; set; }
        public int? UserId { get; set; }
        public string TransactionType { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Frequency { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual User? User { get; set; }
    }
}
