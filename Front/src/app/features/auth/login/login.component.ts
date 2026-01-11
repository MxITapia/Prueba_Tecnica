import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  form = this.fb.group({
    username: ['admin@vector.cl', [Validators.required, Validators.email]],
    password: ['Admin10.01', [Validators.required]]
  });

  loading = signal(false);

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const { username, password } = this.form.value;

    this.authService.login(username!, password!).subscribe({
      next: (response) => {
        this.authService.saveSession(response);
        this.toastService.show(`¡Bienvenido ${response.user.username}!`, 'success');
        this.router.navigate(['/']);
        this.loading.set(false);
      },
      error: (error) => {
        this.toastService.show(error.error?.message || 'Error al iniciar sesión', 'error');
        this.loading.set(false);
      }
    });
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.touched && control?.invalid;
  }
}
