import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'https://localhost:7074/api/expenses'; // Backend URL for expenses
  private budgetApiUrl = 'https://localhost:7074/api/budgets'; // Backend URL for budgets

  constructor(private http: HttpClient) {}

  // Get all expenses
  getExpenses(): Observable<Expense[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Expense[]>(this.apiUrl, { headers });
  }

  // Add a new expense
  addExpense(expense: any): Observable<Expense> {
    const headers = this.createAuthHeaders();
    return this.http.post<Expense>(this.apiUrl, expense, { headers });
  }

  // Update an existing expense
  updateExpense(expenseId: number, expense: any): Observable<Expense> {
    const headers = this.createAuthHeaders();
    return this.http.put<Expense>(`${this.apiUrl}/${expenseId}`, expense, { headers });
  }

  // Delete an expense
  deleteExpense(expenseId: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`, { headers });
  }

  // Create Authorization headers
  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // Get token from local storage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
