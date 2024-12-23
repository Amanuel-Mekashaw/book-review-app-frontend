import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token') ?? '';
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
    }
  }
  return next(request);
};
