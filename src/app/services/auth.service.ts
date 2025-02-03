import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7074/api/authentication';  // Update with your backend URL
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // Register a new user
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Login the user
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          this.storeToken(response.token);
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Store token in local storage
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout user by removing token
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Get user details (protected route)
  getUserDetails(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return throwError(() => new Error('Unauthorized: No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}/user-details`, { headers }).pipe(
      catchError((error) => {
        console.error('Fetching user details failed:', error);
        return throwError(() => error);
      })
    );
  }
}
