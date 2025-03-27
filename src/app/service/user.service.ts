import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

// Interface representing a user
export interface User {
  mod: boolean;           // Flag indicating if the user is a moderator
  email: string;          // User's email
  password: string;       // User's password
  cart: Product[];        // User's cart items
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev/users'; // API URL

  constructor(private http: HttpClient) { }

  /**
   * Registers a new user.
   * @param user - User object containing email, password, mod flag, and cart.
   * @returns Observable of the newly registered user.
   */
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  /**
   * Logs in a user by email and password.
   * @param email - User's email.
   * @param password - User's password.
   * @returns Observable of the logged-in user data.
   */
  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }

  /**
   * Fetches the user details by email (including cart items).
   * @param email - Email of the user whose details are to be fetched.
   * @returns Observable of the user data.
   */
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${email}`);
  }
}
