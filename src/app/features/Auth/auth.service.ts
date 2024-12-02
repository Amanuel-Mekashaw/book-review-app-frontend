import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSignal = signal<AuthResponse | undefined | null>(undefined);
}
