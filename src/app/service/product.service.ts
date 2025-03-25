import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class ProductService {

  private apiUrl = 'https://qaj2dzzyg6.execute-api.us-east-1.amazonaws.com/dev/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
}
