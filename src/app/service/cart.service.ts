import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';
import { AuthService } from './auth.service';
import { switchMap, filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev/users'; // API URL
  private cartItems: Product[] = []; // Array to store the current user's cart items locally
  private cartItemsSubject = new BehaviorSubject<Product[]>(this.cartItems); // Subject to show cart updates
  cartItems$ = this.cartItemsSubject.asObservable(); // Observable for subscribing to cart updates

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Fetches the cart items of the current user.
   * @returns Observable of an array of Product objects in the cart.
   */
  getCartItems(): Observable<Product[]> {
    return this.authService.userEmail$.pipe(
      filter(email => !!email),
      switchMap(email => this.http.get<{ cart: Product[] }>(`${this.apiUrl}/${email}/cart`)),
      map(response => response.cart)
    );
  }

  // A place holder method to store products from the API
  private getAllProducts(): Product[] {
    return [];
  }

  /**
   * Adds a product to the cart of the current user.
   * @param product - The product to be added to the cart.
   */
  addToCart(product: Product): void {
    this.authService.userEmail$.pipe(
      filter(email => !!email),
      switchMap(email => this.http.put<{ cart: string[] }>(`${this.apiUrl}/${email}/cart`, { productId: product._id }))
    ).subscribe({
      next: (response) => {
        // Map the response cart items (which are product IDs) to actual product objects
        this.cartItems = response.cart.map(id => {
          return this.getAllProducts().find(product => product._id === id);
        }).filter(product => product !== undefined);
        this.cartItemsSubject.next(this.cartItems);
      },
      error: (err) => {
        console.error('Error adding item to cart:', err); // Log error if adding item fails
      }
    });
  }

  /**
   * Removes a product from the cart.
   * @param productId - The ID of the product to be removed from the cart.
   * @returns Observable of void, as no content is returned on successful deletion.
   */
  removeItem(productId: string): Observable<void> {
    return this.authService.userEmail$.pipe(
      filter(email => !!email), // Ensure the email is available
      switchMap(email =>
        this.http.delete<void>(`${this.apiUrl}/${email}/cart/${productId}`) // Send request to delete the product from the user's cart
      ),
      tap(() => {
        // After the deletion is successful, update the local cart items
        this.cartItems = this.cartItems.filter(item => item._id !== productId);
        this.cartItemsSubject.next(this.cartItems);
      })
    );
  }
}
