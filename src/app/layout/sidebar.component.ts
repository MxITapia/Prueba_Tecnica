import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  
  public authService = inject(AuthService); 
}
