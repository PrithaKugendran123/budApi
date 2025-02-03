import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incomes } from '../models/incomes.model';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = 'https://localhost:7074/api/Incomes';

  constructor(private http: HttpClient) {}

  getIncomes(): Observable<Incomes[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Incomes[]>(this.apiUrl, { headers });
  }

  addIncome(income: Incomes): Observable<Incomes> {
    const headers = this.createAuthHeaders();
    return this.http.post<Incomes>(this.apiUrl, income, { headers });
  }

  updateIncome(id: number, income: Incomes): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/${id}`, income, { headers });
  }

  deleteIncome(id: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
