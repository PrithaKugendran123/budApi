export interface Incomes {
  incomeId: number;
  userId: number;
  amount: number;
  date: string; // Change the type of 'date' to string to handle formatted date
  category: string;
  notes?: string;
  createdAt?: Date;
}
