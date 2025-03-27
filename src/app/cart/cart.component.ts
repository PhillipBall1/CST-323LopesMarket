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
  cartItems: Product[] = []; // Holds the list of products in the cart
  totalPrice: number = 0; // Stores the total price of items in the cart

  // Inject CartService to handle cart operations
  constructor(private cartService: CartService) {}

  /**
   * Runs when the component initializes.
   * Fetches the cart items from the service and calculates the total price.
   */
  ngOnInit() {
    this.cartService.getCartItems().subscribe({
      next: (items: Product[]) => { // Expect an array of Product objects
        console.log('Cart items received:', items);

        if (items && Array.isArray(items)) {
          this.cartItems = items; // Assign the fetched cart items to the local variable
        } else {
          console.warn('Unexpected API response format:', items);
        }

        this.calculateTotal(); // Calculate the total price after fetching items
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      }
    });
  }

  /**
   * Updates the quantity of a specific product in the cart.
   * @param product - The product to update
   * @param change - The amount (1 or -1) to change the quantity by
   */
  updateQuantity(product: Product, change: number) {
    const newQuantity = product.quantity + change;
    if (newQuantity > 0) { // Ensure quantity does not go below 1
      product.quantity = newQuantity;
      this.calculateTotal(); // Recalculate total price
    }
  }

  /**
   * Removes an item from the cart based on its ID.
   * @param productId - The ID of the product to remove
   */
  removeItem(productId: string) {
    this.cartService.removeItem(productId).subscribe(() => {
      // Filter out the removed item from the cart array
      this.cartItems = this.cartItems.filter(item => item._id !== productId);
      this.calculateTotal(); // Recalculate total price after item removal
    });
  }

  /**
   * Calculates the total price of all items in the cart.
   */
  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
