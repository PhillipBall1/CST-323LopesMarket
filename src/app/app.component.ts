import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsListComponent } from './products-list/products-list.component';
import { NavBarComponent } from './global/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ProductsListComponent,
    NavBarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'lopes-market';
}
