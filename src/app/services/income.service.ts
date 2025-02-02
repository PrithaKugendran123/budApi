import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incomes } from '../models/incomes.model';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = 'https://localhost:7074/api/Incomes'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  getIncomes(): Observable<Incomes[]> {
    return this.http.get<Incomes[]>(this.apiUrl);
  }

  getIncomesByCategory(category: string): Observable<Incomes[]> {
    return this.http.get<Incomes[]>(`${this.apiUrl}/ByCategory/${category}`);
  }

  addIncome(income: Incomes): Observable<Incomes> {
    return this.http.post<Incomes>(this.apiUrl, income);
  }

  updateIncome(id: number, income: Incomes): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, income);
  }

  deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
