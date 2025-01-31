using System;
using System.Collections.Generic;

namespace budt.Models
{
    public partial class Income
    {
        public int IncomeId { get; set; }
        public int? UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; } = null!;
        public string? Notes { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual User? User { get; set; }
    }
}
