using System;
using System.Collections.Generic;

namespace budt.Models
{
    public partial class Expense
    {
        public int ExpenseId { get; set; }
        public int? BudgetId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual Budget? Budget { get; set; }
    }
}
