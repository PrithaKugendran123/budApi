export interface Expense {
  expenseId: number; // Change from "expenseID" to "expenseId"
  budgetId: number;
  amount: number;
  date: string;
  category: string;
  notes: string;
  createdAt: Date;
}
