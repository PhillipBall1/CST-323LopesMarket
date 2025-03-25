import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // Add this import for ReactiveFormsModule
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule  // Include this in standalone component
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.userService.registerUser({ email, password, cart: [] }).subscribe(
        (user) => {
          // Handle successful registration
          this.router.navigate(['/login']);
        },
        (error) => {
          // Handle registration error
          console.error('Registration failed:', error);
        }
      );
    }
  }
}
