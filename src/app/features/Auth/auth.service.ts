import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthorDetailsResponse, AuthResponse, User } from './user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);

  currentUserSignal = signal<AuthResponse | null>(null);
  currentUserDetail = signal<AuthorDetailsResponse | null>(null);

  initializeUser(): void {
    if (this.currentUserSignal() === null) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.currentUserSignal.set(JSON.parse(atob(userData)));
      }
    }
  }

  navigateBasedOnUserDetail(): void {
    if (this.currentUserDetail() === null) {
      this.router.navigateByUrl('/dashboard/profile');
    } else {
      this.router.navigateByUrl('/books');
    }
  }
}
