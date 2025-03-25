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
  products: Product[] = [];
  newProduct: Product = { _id: '', item_name: '', quantity: 0, price: 0, category: '' };
  isEditing: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  // Get all products
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products; // Assign the response array to products
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  // Create a new product
  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding product', err);
      }
    });
  }

  // Delete a product
  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product._id !== id);
      },
      error: (err) => {
        console.error('Error deleting product', err);
      }
    });
  }

  // Edit (populate form for) an existing product
  editProduct(product: Product): void {
    this.newProduct = { ...product }; // Copy selected product into form fields
    this.isEditing = true; // Set the flag to true, indicating we are in edit mode
  }

  // Update an existing product
  updateProduct(): void {
    if (this.newProduct._id) {
      const updatedProduct: Product = { ...this.newProduct, _id: this.newProduct._id };
      this.productService.updateProduct(this.newProduct._id, updatedProduct).subscribe({
        next: () => {
          // after edit, refresh list and reset form
          this.getProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating product', err);
        }
      });
    }
  }

  // Reset form for adding or editing products
  resetForm(): void {
    this.newProduct = { _id: '', item_name: '', quantity: 0, price: 0, category: '' };
    this.isEditing = false;
  }
}
