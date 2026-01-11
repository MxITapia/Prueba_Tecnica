import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, Product } from '../../core/models/product.model';
import { CategoryService } from '../../core/services/category.service';
import { ModalService } from '../../core/services/modal.service';
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
  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);
  
  products = signal<Product[]>([]);
  total = signal(0);
  categories = signal<Category[]>([]);
  
  page = 1;
  limit = 10;
  searchTerm = '';

  constructor() {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Error cargando categorías', err)
    });
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
    this.modalService.open({
        title: 'Eliminar producto',
        message: '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
        type: 'confirm',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        onConfirm: () => {
            this.productService.deleteProduct(id).subscribe({
                next: () => this.loadProducts(),
                error: (err) => {
                     this.modalService.open({
                        title: 'Error',
                        message: 'No se pudo eliminar el producto',
                        type: 'error'
                     });
                }
            });
        }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }

  getCategoryName(product: Product): string {
    // Prioridad 1: Si tiene objeto Categoria completo con nombre
    if (product.Categoria?.nombre) {
      return product.Categoria.nombre;
    }
    // Prioridad 2: Si tiene categoria como string directo
    if (product.categoria && typeof product.categoria === 'string') {
      return product.categoria;
    }
    // Prioridad 3: Si solo tiene id_categoria, buscar en el array
    if (product.id_categoria) {
      const category = this.categories().find(c => c.id === product.id_categoria);
      return category?.nombre || 'Sin categoría';
    }
    return 'Sin categoría';
  }

  titleCase(str: string) {
     return str; // Simple retorno, angular pipe titlecase puede usarse en template
  }
}
