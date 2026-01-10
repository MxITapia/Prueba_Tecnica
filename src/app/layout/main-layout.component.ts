import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
    isMobileMenuOpen = signal(false);

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    closeMobileMenu() {
        this.isMobileMenuOpen.set(false);
    }
}
