import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  email: string;
  password: string;
  cart: Product[];
}

export interface Product {
  _id: string;
  item_name: string;
  quantity: number;
  price: number;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev/users';

  constructor(private http: HttpClient) { }

  // Register a new user
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  // Login user
  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }

  // Get user by email (can include cart)
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${email}`);
  }

  // Get items in cart for a user
  getItemsInCart(email: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${email}/cart`);
  }

  // Add item to user's cart
  addItemToCart(email: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${email}/cart`, product);
  }

  // Delete item from user's cart
  deleteItemFromCart(email: string, productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}/cart/${productId}`);
  }
}
