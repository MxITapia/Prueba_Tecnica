import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.isOpen() && modalService.data(); as data) {
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
             (click)="modalService.cancel()"></div>

        <!-- Modal Panel -->
        <div class="relative bg-white rounded-2xl shadow-2xl transform transition-all sm:w-full sm:max-w-lg overflow-hidden animate-fade-in-up border border-white/20">
            
            <!-- Icon Config -->
            <div class="p-6 text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6"
                    [ngClass]="{
                        'bg-blue-100 text-blue-600': data.type === 'info',
                        'bg-green-100 text-green-600': data.type === 'success',
                        'bg-red-100 text-red-600': data.type === 'error',
                        'bg-yellow-100 text-yellow-600': data.type === 'warning',
                        'bg-indigo-100 text-indigo-600': data.type === 'confirm'
                    }">
                    
                    @if(data.type === 'confirm') {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    @if(data.type === 'error') {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    @if(data.type === 'success') {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    @if(data.type === 'warning') {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                     @if(data.type === 'info') {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                </div>

                <h3 class="text-2xl font-bold text-slate-900 mb-2">{{data.title}}</h3>
                <p class="text-slate-500 text-base leading-relaxed">{{data.message}}</p>
            </div>

            <!-- Footer / Buttons -->
            <div class="px-6 py-4 bg-slate-50 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
                @if (data.type === 'confirm') {
                    <button type="button" 
                        (click)="modalService.confirm()"
                        class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all">
                        {{ data.confirmText || 'Aceptar' }}
                    </button>
                    <button type="button" 
                        (click)="modalService.cancel()"
                        class="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-all">
                        {{ data.cancelText || 'Cancelar' }}
                    </button>
                } @else {
                    <button type="button" 
                        (click)="modalService.cancel()"
                        class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-slate-900 text-base font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:w-auto sm:text-sm transition-all">
                        {{ data.cancelText || 'Cerrar' }}
                    </button>
                }
            </div>
        </div>
    </div>
    }
  `
})
export class ModalComponent {
  modalService = inject(ModalService);
}
