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
  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev/users';
  private cartItems: Product[] = [];
  private cartItemsSubject = new BehaviorSubject<Product[]>(this.cartItems);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCartItems(): Observable<Product[]> {
    return this.authService.userEmail$.pipe(
      filter(email => !!email),
      switchMap(email => this.http.get<{ cart: Product[] }>(`${this.apiUrl}/${email}/cart`)),
      map(response => response.cart)
    );
  }


  private getAllProducts(): Product[] {
    return [];
  }

  addToCart(product: Product): void {
    this.authService.userEmail$.pipe(
      filter(email => !!email),
      switchMap(email => this.http.put<{ cart: string[] }>(`${this.apiUrl}/${email}/cart`, { productId: product._id }))
    ).subscribe({
      next: (response) => {
        this.cartItems = response.cart.map(id => {
          return this.getAllProducts().find(product => product._id === id);
        }).filter(product => product !== undefined);
        this.cartItemsSubject.next(this.cartItems);
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
      }
    });
  }

  removeItem(productId: string): Observable<void> {
    return this.authService.userEmail$.pipe(
      filter(email => !!email),
      switchMap(email =>
        this.http.delete<void>(`${this.apiUrl}/${email}/cart/${productId}`)
      ),
      tap(() => {
        // After the deletion is successful, update the local cart items
        this.cartItems = this.cartItems.filter(item => item._id !== productId);  // Update the local cart state
        this.cartItemsSubject.next(this.cartItems);  // Emit the updated cart items to subscribers
      })
    );
  }
}
