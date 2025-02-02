export interface Budget {
  budgetId: number;
  userID: number;
  categoryName: string;
  budgetAmount: number;
  duration: 'Monthly' | 'Weekly' | 'Yearly';
  createdAt: Date;
}
