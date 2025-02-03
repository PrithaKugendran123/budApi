export interface Incomes {
  incomeId: number;
  userId: number;
  amount: number;
  date: string; // Handle date as string
  category: string;
  notes?: string;
  createdAt?: Date;
}
