import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup; // Form group to handle login form controls and validation

  constructor(
    private fb: FormBuilder, // FormBuilder to create and manage form controls
    private userService: UserService, // Service to handle user authentication
    private router: Router, // Router service to navigate after login
    private authService: AuthService // Authentication service to manage login state
  ) {
    // Initialize the login form with email and password fields
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with required and email validation
      password: ['', Validators.required] // Password field with required validation
    });
  }

  /**
   * Handles the login process.
   * Validates the form, then calls the loginUser service method.
   */
  onLogin() {
    if (this.loginForm.invalid) {
      return; // Stop execution if the form is invalid
    }

    const { email, password } = this.loginForm.value; // Extract form values

    // Call the login service to authenticate the user
    this.userService.loginUser(email, password).subscribe({
      next: (response: any) => {
        this.authService.login(response.token); // Store authentication token
        this.router.navigate(['/']); // Redirect to the home page after successful login
      },
      error: (err) => {
        alert('Login failed: ' + err.error.message); // Display error message on failure
      }
    });
  }
}
