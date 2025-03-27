import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  isLoggedIn: boolean = false; // Tracks the user's authentication status
  isMod: boolean = false; // Tracks if the user has moderator privileges

  // Inject the authentication service to manage user authentication
  constructor(private authService: AuthService) {}

  /**
   * Runs when the component initializes.
   * Subscribes to authentication status and moderator status observables.
   */
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn; // Update login status
    });

    this.authService.isMod$.subscribe((modStatus) => {
      this.isMod = modStatus; // Update moderator status
    });
  }

  /**
   * Logs out the user after confirming their action.
   * Calls the logout method from AuthService.
   */
  logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      this.authService.logout(); // Perform logout operation
    }
  }
}
