export interface TransactionsLog {
    logID: number;
    userID: number;
    transactionType: 'Income' | 'Expense'; // Restrict to specific types
    categoryName: string;
    amount: number;
    date: Date;
    notes?: string;
    createdAt: Date;
  }
  