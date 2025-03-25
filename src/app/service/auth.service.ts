import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev';
  private _isLoggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('jwtToken'));
  private _userEmail = new BehaviorSubject<string | null>(null);
  private _isMod = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this._isLoggedIn.asObservable();
  userEmail$ = this._userEmail.asObservable();
  isMod$ = this._isMod.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    this.http.get<any>(`${this.apiUrl}/current-user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (user) => {
        this._userEmail.next(user.email);
        this._isMod.next(user.mod);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
        this._userEmail.next(null);
        this._isMod.next(false);
      },
    });
  }

  login(token: string) {
    localStorage.setItem('jwtToken', token);
    this._isLoggedIn.next(true);
    this.loadUser();
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this._isLoggedIn.next(false);
    this._userEmail.next(null);
    this._isMod.next(false);
    this.router.navigate(['/login']);
  }
}
