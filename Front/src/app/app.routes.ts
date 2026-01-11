import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent 
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'productos', pathMatch: 'full' },
            { 
                path: 'productos', 
                loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES) 
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
