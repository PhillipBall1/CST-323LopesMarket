import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];  // Array to hold all fetched products
  filteredProducts: Product[] = [];  // Array to hold products after applying filters
  searchQuery: string = '';  // Holds the search input value
  selectedCategory: string = '';  // Holds the selected category from the filter
  selectedPriceRange: string = '';  // Holds the selected price range from the filter
  categories: string[] = [];  // Array to hold unique product categories
  priceRanges: number[] = [20, 40, 60, 80, 100];  // Available price ranges for filtering
  showSuccessMessage: boolean = false;  // Flag to control the display of the success message when an item is added to the cart

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router

) {}

  /**
   * Initializes the component and fetches the list of products.
   */
  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Fetches products from the ProductService and stores them in the products array.
   * Also sets up the categories array with unique categories from the fetched products.
   */
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;  // Store all fetched products
        this.filteredProducts = products;  // Initialize filtered products with all products
        this.categories = [...new Set(products.map(product => product.category))];  // Extract unique categories
      },
      error: (err) => {
        console.error('Error fetching products', err);  // Log any errors
      }
    });
  }

  /**
   * Adds a product to the cart and displays a success message.
   * The success message disappears after 3 seconds.
   * @param product - The product to be added to the cart
   */
  addToCart(product: Product): void {
    // Check if the user is logged in
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // If the user is logged in, add the selected product to the cart
        this.cartService.addToCart(product);

        // Show success message
        this.showSuccessMessage = true;

        // Hide the success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      } else {
        // Redirect to the login page if not logged in
        this.router.navigate(['/login']);
      }
    });
  }


  /**
   * Filters the products based on the search query, selected category, and selected price range.
   */
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Check if the product matches the search query (either name or category)
      const matchesSearch = product.item_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Check if the product matches the selected category
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;

      // Check if the product matches the selected price range
      const matchesPrice = this.selectedPriceRange ? product.price <= parseInt(this.selectedPriceRange) : true;

      // Return true if the product matches all selected filters
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }
}
