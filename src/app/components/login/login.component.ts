import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
  // Make sure to import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';  // Initialize the errorMessage property with a default value

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  // Method called when the user submits the login form
  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      // Call login service
      this.authService.login(email, password).subscribe(
        (response: any) => {
          // Assuming the response contains the JWT token
          localStorage.setItem('token', response.token);  // Store JWT token in localStorage
          this.router.navigate(['/dashboard']);  // Navigate to the dashboard page after login
        },
        (error) => {
          // Handle any errors that may occur during login
          this.errorMessage = 'Invalid login credentials';  // Display error message
        }
      );
    }
  }
}
