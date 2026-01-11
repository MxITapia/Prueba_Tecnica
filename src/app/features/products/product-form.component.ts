import { CommonModule } from '@angular/common';
import { Component, inject, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../core/models/product.model';
import { CategoryService } from '../../core/services/category.service';
import { ModalService } from '../../core/services/modal.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    id_categoria: [null as number | null]
  });

  isEditMode = signal(false);
  productId = signal<number | null>(null);
  loading = signal(false);
  categories = signal<Category[]>([]);

  ngOnInit() {
    this.loadCategories();
    this.route.params.subscribe(params => {
        if (params['id']) {
            this.isEditMode.set(true);
            this.productId.set(+params['id']);
            this.loadProduct(this.productId()!);
        }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  loadProduct(id: number) {
      this.productService.getProduct(id).subscribe({
          next: (product) => {
              this.form.patchValue(product);
          },
          error: (err) => console.error('Error cargando producto', err)
      });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.loading.set(true);
    const formValue = this.form.value;
    
    // Preparar objeto base
    const productData: any = {
      nombre: formValue.nombre,
      precio: formValue.precio
    };

    // Lógica robusta para id_categoria
    const rawCat = formValue.id_categoria;
    
    // Verificar si tiene valor significativo
    if (rawCat !== null && rawCat !== undefined && String(rawCat) !== '' && String(rawCat) !== 'null') {
        const parsed = Number(rawCat);
        if (!isNaN(parsed)) {
            productData.id_categoria = parsed;
        }
    }
    // NOTA: Si no hay categoría, NO enviamos la propiedad id_categoria en absoluto.
    // Esto evita que el backend falle validando "null" vs "number".

    console.log('Enviando datos de producto:', productData);

    const request = this.isEditMode() 
        ? this.productService.updateProduct(this.productId()!, productData)
        : this.productService.createProduct(productData);

    request.subscribe({
        next: () => {
            this.router.navigate(['/productos']);
        },
        error: (err) => {
            console.error('Error completo:', err);
            this.loading.set(false);
            const errorMessage = err.error?.message || err.message || 'Error al guardar el producto';
            this.modalService.open({
                title: 'Error',
                message: errorMessage,
                type: 'error',
                cancelText: 'Cerrar'
            });
        }
    });
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.touched && control?.invalid;
  }
}
