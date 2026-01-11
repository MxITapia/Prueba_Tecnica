import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  ngOnInit() {
    this.route.params.subscribe(params => {
        if (params['id']) {
            this.isEditMode.set(true);
            this.productId.set(+params['id']);
            this.loadProduct(this.productId()!);
        }
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
    const productData = this.form.value as any;

    const request = this.isEditMode() 
        ? this.productService.updateProduct(this.productId()!, productData)
        : this.productService.createProduct(productData);

    request.subscribe({
        next: () => {
            this.router.navigate(['/productos']);
        },
        error: (err) => {
            console.error(err);
            this.loading.set(false);
            alert('Error al guardar el producto');
        }
    });
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.touched && control?.invalid;
  }
}
