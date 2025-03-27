import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductResponse } from '../service/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = []; // Holds the list of products
  newProduct: Product = { _id: '', item_name: '', quantity: 0, price: 0, category: '' }; // Object for creating or editing a product
  isEditing: boolean = false; // Flag to indicate edit mode

  constructor(private productService: ProductService) { }

  /**
   * Runs when the component initializes.
   * Fetches the list of products.
   */
  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Fetches all products from the service.
   */
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products; // Assign the fetched products to the local array
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  /**
   * Creates a new product and adds it to the list.
   */
  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product); // Add the new product to the list
        this.resetForm(); // Reset the form fields
      },
      error: (err) => {
        console.error('Error adding product', err);
      }
    });
  }

  /**
   * Deletes a product based on its ID.
   * @param id - The ID of the product to be deleted.
   */
  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product._id !== id); // Remove the product from the list
      },
      error: (err) => {
        console.error('Error deleting product', err);
      }
    });
  }

  /**
   * Populates the form fields with an existing product's data for editing.
   * @param product - The product to be edited.
   */
  editProduct(product: Product): void {
    this.newProduct = { ...product }; // Copy product details to the form
    this.isEditing = true; // Enable edit mode
  }

  /**
   * Updates an existing product with new values.
   */
  updateProduct(): void {
    if (this.newProduct._id) {
      const updatedProduct: Product = { ...this.newProduct, _id: this.newProduct._id };
      this.productService.updateProduct(this.newProduct._id, updatedProduct).subscribe({
        next: () => {
          this.getProducts(); // Refresh product list after update
          this.resetForm(); // Reset the form fields
        },
        error: (err) => {
          console.error('Error updating product', err);
        }
      });
    }
  }

  /**
   * Resets the form fields and exits edit mode.
   */
  resetForm(): void {
    this.newProduct = { _id: '', item_name: '', quantity: 0, price: 0, category: '' };
    this.isEditing = false;
  }
}
