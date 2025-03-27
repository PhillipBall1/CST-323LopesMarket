import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// Interface to represent a product
export interface Product {
  _id: string;           // Unique identifier
  item_name: string;     // Name of the product
  quantity: number;      // Available quantity of the product
  price: number;         // Price of the product
  category: string;      // Category for the product
}

// Interface for the response from the product API
export interface ProductResponse {
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev/products'; // API URL
  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of products from the API.
   * @returns Observable array of products.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(this.apiUrl).pipe(
      map(response => response.products)
    );
  }

  /**
   * Creates a new product by sending a POST request to the API.
   * @param product - The product object to be created.
   * @returns Observable of the newly created product.
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Deletes a product based on its ID.
   * @param id - The ID of the product to be deleted.
   * @returns Observable of void (no content returned).
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Updates an existing product by its ID.
   * @param id - The ID of the product to be updated.
   * @param product - The updated product data.
   * @returns Observable of the updated product.
   */
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
}
