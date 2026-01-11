import { Routes } from '@angular/router';
import { ProductFormComponent } from './product-form.component';
import { ProductListComponent } from './product-list.component';

export const PRODUCT_ROUTES: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'nuevo', component: ProductFormComponent },
    { path: 'editar/:id', component: ProductFormComponent }
];
