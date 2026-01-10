import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductDto, Product, UpdateProductDto } from '../models/product.model';
import { ApiService } from './api.service';

// Respuesta del backend según tu estructura
export interface ProductResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = inject(ApiService);
  private basePath = '/productos';

  getProducts(page: number = 1, limit: number = 10, nombre?: string, categoria?: string): Observable<ProductResponse> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());
    
    if (nombre) params = params.set('nombre', nombre);
    if (categoria) params = params.set('categoria', categoria);

    return this.api.get<ProductResponse>(this.basePath, params);
  }

  getProduct(id: number): Observable<Product> {
    return this.api.get<Product>(`${this.basePath}/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.api.post<Product>(this.basePath, product);
  }

  updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
    return this.api.put<Product>(`${this.basePath}/${id}`, product);
  }

  deleteProduct(id: number): Observable<{message: string}> {
    return this.api.delete<{message: string}>(`${this.basePath}/${id}`);
  }
}
