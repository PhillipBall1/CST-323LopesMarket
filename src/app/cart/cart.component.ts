import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Product } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe({
      next: (items: Product[]) => { // Expect an array of Product objects
        console.log('Cart items received:', items);

        if (items && Array.isArray(items)) {
          this.cartItems = items; // Directly assign the cart items
        } else {
          console.warn('Unexpected API response format:', items);
        }

        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      }
    });
  }

  updateQuantity(product: Product, change: number) {
    const newQuantity = product.quantity + change;
    if (newQuantity > 0) {
      product.quantity = newQuantity;
      this.calculateTotal();
    }
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item._id !== productId);
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
