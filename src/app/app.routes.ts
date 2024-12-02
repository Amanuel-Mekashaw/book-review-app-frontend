import { Routes } from '@angular/router';

export const routes: Routes = [
  // Auth Routes
  {
    path: 'login',
    loadComponent: () =>
      import('../app/features/Auth/login/login.component').then(
        (c) => c.LoginComponent,
      ),
    title: 'login page',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/features/Auth/register/register.component').then(
        (c) => c.RegisterComponent,
      ),
    title: 'register page',
  },

  // Home page routes
  {
    path: '',
    loadComponent: () =>
      import('../app/features/shared/components/layout/layout.component').then(
        (c) => c.LayoutComponent,
      ),
    children: [
      {
        path: 'books',
        title: 'books page',
        loadComponent: () =>
          import('../app/features/books/books.component').then(
            (c) => c.BooksComponent,
          ),
      },
      {
        path: 'books/:bookId',
        loadComponent: () =>
          import('./features/BookDetails/BookDetails.component').then(
            (c) => c.BookDetailsComponent,
          ),
      },

      {
        path: 'genres',
        title: 'genre page',
        loadComponent: () =>
          import('../app/features/Genre/Genre.component').then(
            (c) => c.GenreComponent,
          ),
      },
      {
        path: 'collections',
        title: 'Collection page',
        loadComponent: () =>
          import('../app/features/Collection/Collection.component').then(
            (c) => c.CollectionComponent,
          ),
      },
    ],
  },

  // Dashboard routes
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        '../app/features/shared/components/dashboard-layout/dashboard-layout.component'
      ).then((c) => c.DashboardLayoutComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/ProfileDashboard/ProfileDashboard.component'
          ).then((c) => c.ProfileDashboardComponent),
      },
      {
        path: 'books',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/BooksDashboard/BooksDashboard.component'
          ).then((c) => c.BooksDashboardComponent),
      },
      {
        path: 'genres',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/GenreDashboard/GenreDashboard.component'
          ).then((c) => c.GenreDashboardComponent),
      },
      {
        path: 'collections',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/CollectionsDashboard/CollectionsDashboard.component'
          ).then((c) => c.CollectionsDashboardComponent),
      },
    ],
  },

  // Not found route must be in the bottom
  {
    path: '**',
    loadComponent: () =>
      import(
        '../app/features/shared/components/NotFound/NotFound.component'
      ).then((c) => c.NotFoundComponent),
    title: 'Page not found',
  },
];
