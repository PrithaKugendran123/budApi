import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://localhost:7074/api/TransactionsLogs';

  constructor(private http: HttpClient) {}

  getTransactions(month?: number, year?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;
    }
    return this.http.get<any[]>(url);
  }

  getTransactionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getTransactionsByMonth(month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions-by-month?month=${month}&year=${year}`);
  }
  
}
