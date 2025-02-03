import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'https://localhost:7074/api/Budgets'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  // Include authorization headers in the request
  private getHeaders() {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage or another place
    console.log('Token:', token); // Log token for debugging (ensure it's not null)
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // If using JWT token
      'Content-Type': 'application/json',
    });
  }

  // Fetch all budgets with authorization
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getBudgetWithProgress(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/MGet`, { headers: this.getHeaders() });
  }

  // Add new budget with authorization
  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget, { headers: this.getHeaders() });
  }

  // Update existing budget with authorization
  updateBudget(id: number, budget: Budget): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, budget, { headers: this.getHeaders() });
  }

  // Delete budget with authorization
  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
