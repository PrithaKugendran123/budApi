import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://localhost:7074/api/TransactionsLogs';  // Correct the base URL as per your API structure

  constructor(private http: HttpClient) {}

  // Get all transactions or filter by month/year
  getTransactions(month?: number, year?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;  // Use query parameters for filtering by month/year
    }
    return this.http.get<any[]>(url);  // Return an observable with the transaction data
  }

  // Get a specific transaction by ID
  getTransactionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);  // Endpoint to get a specific transaction
  }

  // Get transactions filtered by a specific month and year
  getTransactionsByMonth(month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions-by-month?month=${month}&year=${year}`);  // Filtered by month and year
  }
}
