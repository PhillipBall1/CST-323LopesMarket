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
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    // Use the UserService to call the loginUser method
    this.userService.loginUser(email, password).subscribe({
      next: (response: any) => {
        this.authService.login(response.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Login failed: ' + err.error.message);
      }
    });
  }
}
