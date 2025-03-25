import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
standalone: true,
  imports: [CommonModule, FormsModule  ],
  styleUrls: ['./shop.component.css']
})


export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  categories: string[] = [];
  priceRanges: number[] = [20, 40, 60, 80, 100];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = [...new Set(products.map(product => product.category))];
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Filter by search query
      const matchesSearch = product.item_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Filter by selected category
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;

      // Filter by selected price range
      const matchesPrice = this.selectedPriceRange ? product.price <= parseInt(this.selectedPriceRange) : true;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }
}
