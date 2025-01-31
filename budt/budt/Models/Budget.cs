using System;
using System.Collections.Generic;

namespace budt.Models
{
    public partial class Budget
    {
        public Budget()
        {
            Expenses = new HashSet<Expense>();
        }

        public int BudgetId { get; set; }
        public int? UserId { get; set; }
        public string CategoryName { get; set; } = null!;
        public decimal BudgetAmount { get; set; }
        public string Duration { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }

        public virtual User? User { get; set; }
        public virtual ICollection<Expense> Expenses { get; set; }
    }
}
