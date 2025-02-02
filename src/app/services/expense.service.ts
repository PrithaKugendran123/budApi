import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'https://localhost:7074/api/expenses'; // Update with your backend API URL
  private budgetApiUrl = 'https://localhost:7074/api/budgets'; // URL for budgets

  constructor(private http: HttpClient) {}

  // Get all expenses
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  // Get all budgets
  getBudgets(): Observable<any[]> {
    return this.http.get<any[]>(this.budgetApiUrl);
  }

  // Add a new expense
  addExpense(expense: Expense) {
    return this.http.post<Expense>('https://localhost:7074/api/expenses', expense, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }
  
  

  // Update an existing expense
  updateExpense(expenseId: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${expenseId}`, expense);
  }

  // Delete an expense
  deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`);
  }
}
