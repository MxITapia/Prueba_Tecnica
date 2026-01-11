import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  
  private currentUser: User | null = this.getUserFromStorage();
  private token: string | null = this.getTokenFromStorage();

  login(username: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', { username, password });
  }

  register(username: string, password: string): Observable<{message: string, userId: number}> {
    return this.api.post<{message: string, userId: number}>('/auth/register', { username, password });
  }

  saveSession(loginResponse: LoginResponse) {
    this.currentUser = loginResponse.user;
    this.token = loginResponse.token;
    localStorage.setItem('auth_user', JSON.stringify(loginResponse.user));
    localStorage.setItem('auth_token', loginResponse.token);
  }

  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.currentUser;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  private getUserFromStorage(): User | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem('auth_token');
  }
}
