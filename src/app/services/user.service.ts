import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7074/api/users';  // URL for user-related actions
  private dashboardApiUrl = 'https://localhost:7074/api/users/dashboard';  // URL for dashboard data
  private monthDataApiUrl = 'https://localhost:7074/api/financials/monthdata';  // URL for monthly financial data

  constructor(private http: HttpClient) {}

  // Fetch all users (if necessary, adjust for specific user data fetch)
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Fetch dashboard metrics: total income, total expenses, and remaining budget
  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>(this.dashboardApiUrl);
  }

  // Fetch financial data for a specific month (could include income/expenses/budget)
  getMonthData(month: string): Observable<any> {
    return this.http.get<any>(`${this.monthDataApiUrl}?month=${month}`);  // Fetch month-specific data from backend
  }
}
