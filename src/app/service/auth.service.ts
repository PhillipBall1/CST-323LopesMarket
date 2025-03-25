import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('jwtToken'));
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private router: Router) {} // Inject Router

  login(token: string) {
    localStorage.setItem('jwtToken', token);
    this._isLoggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this._isLoggedIn.next(false);
    this.router.navigate(['/']); // Navigate to home page after logout
  }
}
