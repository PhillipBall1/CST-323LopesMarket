import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev'; // API URL
  private _isLoggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('jwtToken')); // Stores user's login status, defaults to 'true' if token is found in localStorage
  private _userEmail = new BehaviorSubject<string | null>(null); // Stores the email of the logged-in user
  private _isMod = new BehaviorSubject<boolean>(false); // Stores whether the user has moderator privileges (default is false)

  // Observables to be used by other components
  isLoggedIn$ = this._isLoggedIn.asObservable();
  userEmail$ = this._userEmail.asObservable();
  isMod$ = this._isMod.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser(); // Load user information when the service is initialized
  }

  /**
   * Load user data by fetching the current user info using the JWT token.
   * Sets the user's email and moderator status if the token is valid.
   */
  loadUser() {
    const token = localStorage.getItem('jwtToken'); // Retrieve token from localStorage
    if (!token) return; // If no token, return

    // Send a GET request to fetch the current user's info
    this.http.get<any>(`${this.apiUrl}/current-user`, {
      headers: { Authorization: `Bearer ${token}` } // Add token to request header for authentication
    }).subscribe({
      // Successful, update user
      next: (user) => {
        this._userEmail.next(user.email);
        this._isMod.next(user.mod);
      },
      // Unsuccessful, clear info
      error: (err) => {
        console.error('Error fetching user info:', err);
        this._userEmail.next(null);
        this._isMod.next(false);
      },
    });
  }

  /**
   * Login method that stores the JWT token in localStorage and updates the login status.
   * It also loads the user information.
   * @param token - JWT token to be saved and used for authentication
   */
  login(token: string) {
    localStorage.setItem('jwtToken', token);
    this._isLoggedIn.next(true);
    this.loadUser();
  }

  /**
   * Logout method that removes the JWT token, resets the user's login state,
   * and navigates the user to the login page.
   */
  logout() {
    // Reset all info
    localStorage.removeItem('jwtToken');
    this._isLoggedIn.next(false);
    this._userEmail.next(null);
    this._isMod.next(false);

    // Navigate to login
    this.router.navigate(['/login']);
  }
}
