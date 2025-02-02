export interface RecurringTransaction {
    transactionID: number;
    userID: number;
    transactionType: 'Income' | 'Expense'; // Restrict to specific types
    categoryName: string;
    amount: number;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'; // Restrict to specific frequencies
    startDate: Date;
    endDate?: Date; // Optional if no end date
    notes?: string;
    createdAt: Date;
  }
  