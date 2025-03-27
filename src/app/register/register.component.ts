import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,  // Import ReactiveFormsModule for form handling
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // Declare the form group to manage the form state

  constructor(
    private fb: FormBuilder,      // Inject FormBuilder for creating form controls
    private userService: UserService,  // Inject UserService to interact with user-related APIs
    private router: Router         // Inject Router for navigation to different routes
  ) {}

  /**
   * Runs when the component is initialized.
   * It sets up the form controls and their validators.
   */
  ngOnInit(): void {
    // Initialize the registration form with required fields and validation rules
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]], // Email field with validation for required and valid email format
        password: ['', [Validators.required, Validators.minLength(6)]], // Password field with validation for required and minimum length of 6 characters
        confirmPassword: ['', [Validators.required]], // Confirm Password field with required validation
      },
      { validator: this.passwordMatchValidator } // Apply custom validator to ensure password and confirm password match
    );
  }

  /**
   * Custom Validator to check if the password and confirmPassword fields match.
   * If the passwords do not match, an error is set on the confirmPassword field.
   * @param formGroup - The FormGroup instance containing the form controls.
   */
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value; // Get the password value
    const confirmPassword = formGroup.get('confirmPassword')?.value; // Get the confirmPassword value

    // If the passwords do not match, set a 'notMatching' error on the confirmPassword field
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ notMatching: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null); // Clear the error if passwords match
    }
  }

  /**
   * onRegister method is triggered when the user submits the registration form.
   * It checks if the form is valid, then calls the UserService to register the user.
   */
  onRegister() {
    // Check if the form is valid before proceeding with the registration process
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value; // Destructure the form values (email and password)

      // Call the registerUser method from UserService to register the user
      this.userService.registerUser({
        email, password, cart: [],  // Send the user's email, password, and an empty cart
        mod: false                   // Set user role as 'false' (not a moderator)
      }).subscribe(
        (user) => {
          // On successful registration, navigate to the login page
          this.router.navigate(['/login']);
        },
        (error) => {
          // If registration fails, log the error (can also display a message to the user)
          console.error('Registration failed:', error);
        }
      );
    }
  }
}
