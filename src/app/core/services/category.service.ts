import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private api = inject(ApiService);
  private basePath = '/categorias';

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>(this.basePath);
  }

  createCategory(nombre: string): Observable<Category> {
    return this.api.post<Category>(this.basePath, { nombre });
  }
}
