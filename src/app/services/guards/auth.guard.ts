import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token') ?? '';
  if (!token && !isTokenExpired(token)) {
    // router.navigateByUrl('/login');
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (routes, state) => {
  const token = localStorage.getItem('token');

  if (token && !isTokenExpired(token) && isAdmin(token)) {
    return true;
  } else {
    return false;
  }
};

export function isAdmin(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    const admin = decoded.role;

    console.log('decoded role', decoded.role);

    if (admin === 'ADMIN') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Error decoding token:', err);
    return false;
  }
}

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

    return false;
  } catch (err) {
    console.error('Error decoding token:', err);
    return true;
  }
}
