import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  total = signal(0);
  
  page = 1;
  limit = 10;
  searchTerm = '';

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.page, this.limit, this.searchTerm)
        .subscribe(res => {
            this.products.set(res.products);
            this.total.set(res.totalItems);
        });
  }

  onSearch() {
    this.page = 1;
    this.loadProducts();
  }

  deleteProduct(id: number) {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
        this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }

  titleCase(str: string) {
     return str; // Simple retorno, angular pipe titlecase puede usarse en template
  }
}
