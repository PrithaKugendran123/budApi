import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:7074/api';  // Your API URL

  constructor(private http: HttpClient) {}

  // Retrieve the auth token from localStorage
  private getAuthToken(): string {
    const token = localStorage.getItem('token') || '';  // Retrieve from 'token' key instead of 'authToken'
    console.log('Token Retrieved:', token);  // Debugging token
    return token;
  }

  // Fetch total income for the user
  getTotalIncome(): Observable<any> {
    const token = this.getAuthToken();  // Get the auth token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log("Headers for Total Income Request:", headers);  // Log headers

    return this.http.get(`${this.apiUrl}/incomes`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch total income:', error);
        throw error;
      })
    );
  }

  // Fetch total expenses and other dashboard data
  getDashboardData(): Observable<any> {
    const token = this.getAuthToken();  // Get the auth token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log("Headers for Dashboard Request:", headers);  // Log the headers

    return this.http.get(`${this.apiUrl}/expenses/dashboard`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
      })
    );
  }
}
