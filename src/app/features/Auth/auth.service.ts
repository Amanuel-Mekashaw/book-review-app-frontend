import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthorDetailsResponse, AuthResponse, User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<AuthResponse | null>(null);
  currentUserDetail = signal<AuthorDetailsResponse | null>(null);
}
