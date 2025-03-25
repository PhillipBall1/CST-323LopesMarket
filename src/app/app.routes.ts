import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'about', component: AboutComponent },
];
