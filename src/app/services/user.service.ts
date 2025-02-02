import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7074/api/users'; // Update with your API URL
  private dashboardApiUrl = 'https://localhost:7074/api/users/dashboard'; // Dashboard data
  private monthDataApiUrl = 'https://localhost:7074/api/financials/monthdata'; // New endpoint for monthly data

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>(this.dashboardApiUrl);
  }

  getMonthData(month: string): Observable<any> {
    return this.http.get<any>(`${this.monthDataApiUrl}?month=${month}`); // Ensure this matches backend
  }
}
