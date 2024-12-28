import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStorageService } from '../storage/userStorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStorageService = inject(UserStorageService);

  const isLoggedIn = localStorage.getItem('token') ?? ''; // Check if token exists
  if (!isLoggedIn) {
    router.navigateByUrl('/login'); // Redirect to login if not authenticated
    return false; // Deny access
  } else if (userStorageService.isTokenExpired()) {
    userStorageService.clearStorage(); // Clear the expired token
    router.navigateByUrl('/login'); // Redirect to login page
    return false; // Deny access
  }

  return true; // Allow access if authenticated
};
