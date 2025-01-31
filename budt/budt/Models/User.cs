using System;
using System.Collections.Generic;

namespace budt.Models
{
    public partial class User
    {
        public User()
        {
            Budgets = new HashSet<Budget>();
            Incomes = new HashSet<Income>();
            RecurringTransactions = new HashSet<RecurringTransaction>();
            TransactionsLogs = new HashSet<TransactionsLog>();
        }

        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }

        public virtual ICollection<Budget> Budgets { get; set; }
        public virtual ICollection<Income> Incomes { get; set; }
        public virtual ICollection<RecurringTransaction> RecurringTransactions { get; set; }
        public virtual ICollection<TransactionsLog> TransactionsLogs { get; set; }
    }
}
