import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token') ?? '';

    // console.log('Token', token);
    if (token && !isTokenExpired(token)) {
      request = request.clone({
        setHeaders: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
    }
  }
  return next(request);
};

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token); // Decode the token (assumes it has a valid structure)
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decoded.exp < currentTime) {
      // Token is expired
      console.log(
        'Token expired on:',
        new Date(decoded.exp * 1000).toISOString(),
      );
      return true;
    }

    // Token is still valid
    // console.log({
    //   'Expiration time': new Date(decoded.exp * 1000).toISOString(),
    //   'Current time': new Date(currentTime * 1000).toISOString(),
    //   'Expired flag': decoded.exp < currentTime,
    // });

    return false;
  } catch (err) {
    // If an error occurs during decoding, consider the token invalid or expired
    console.error('Error decoding token:', err);
    return true;
  }
}

function logout() {
  const authService = inject(AuthService);
  const router = inject(Router);

  localStorage.removeItem('user');
  localStorage.removeItem('userDetail');
  authService.currentUserSignal.set(null);
  authService.currentUserDetail.set(null);
  localStorage.removeItem('token');
  router.navigateByUrl('/login');
}
