import { Injectable, signal } from '@angular/core';

export interface ModalData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isOpen = signal(false);
  data = signal<ModalData | null>(null);

  open(data: ModalData) {
    this.data.set(data);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    // Limpiar data después de la animación (opcional, aquí simple)
    setTimeout(() => this.data.set(null), 300);
  }

  confirm() {
    const action = this.data()?.onConfirm;
    if (action) action();
    this.close();
  }

  cancel() {
    const action = this.data()?.onCancel;
    if (action) action();
    this.close();
  }
}
