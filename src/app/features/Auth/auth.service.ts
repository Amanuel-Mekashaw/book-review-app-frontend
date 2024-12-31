import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthorDetailsResponse, AuthResponse, User } from './user.interface';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);

  currentUserSignal = signal<AuthResponse | null>(null);
  currentUserDetail = signal<AuthorDetailsResponse | null>(null);

  initializeUser() {
    if (this.currentUserSignal() == null && !this.currentUserDetail()) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.currentUserSignal.set(JSON.parse(atob(userData)));
      }
    }
  }

  navigateBasedOnUserDetail(): void {
    if (
      this.router.url.includes('/register') &&
      this.currentUserSignal() === null
    ) {
      this.router.navigateByUrl('/register');
    } else if (this.currentUserSignal() === null) {
      this.router.navigateByUrl('/login');
    } else if (this.currentUserSignal() !== null) {
      this.router.navigateByUrl('/books');
    } else if (
      this.currentUserSignal() !== null &&
      this.currentUserDetail() === null
    ) {
      this.router.navigateByUrl('/dashboard/profile');
    }
  }
}
