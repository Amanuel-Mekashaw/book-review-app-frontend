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
        path: 'genres/:genreId',
        loadComponent: () =>
          import('../app/features/GenreSingle/GenreSingle.component').then(
            (c) => c.GenreSingleComponent,
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

      {
        path: 'collections/:collectionId',
        loadComponent: () =>
          import(
            '../app/features/CollectionDetail/CollectionDetail.component'
          ).then((c) => c.CollectionDetailComponent),
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
        path: 'profile/edit',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/ProfileDashboard/ProfileEdit/ProfileEdit.component'
          ).then((c) => c.ProfileEditComponent),
      },
      {
        path: 'books',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/BooksDashboard/BooksDashboard.component'
          ).then((c) => c.BooksDashboardComponent),
      },
      {
        path: 'books/edit/:bookId',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/BooksDashboard/BookEdit/BookEdit.component'
          ).then((c) => c.BookEditComponent),
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
      {
        path: 'collections/edit/:collectionId',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/CollectionsDashboard/CollectionEdit/CollectionEdit.component'
          ).then((c) => c.CollectionEditComponent),
      },
    ],
  },

  // Admin dashboard routes
  {
    path: 'admin',
    loadComponent: () =>
      import(
        '../app/features/shared/components/AdminDashboardLayout/AdminDashboardLayout.component'
      ).then((c) => c.AdminDashboardLayoutComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import(
            '../app/features/AdminDashboard/AdminUserDashboard/AdminUserDashboard.component'
          ).then((c) => c.AdminUserDashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            '../app/features/UserDashboard/ProfileDashboard/ProfileDashboard.component'
          ).then((c) => c.ProfileDashboardComponent),
      },
      {
        path: 'profile/edit/:userId',
        loadComponent: () =>
          import(
            '../app/features/AdminDashboard/AdminUserDashboard/AdminProfileEdit/AdminProfileEdit.component'
          ).then((c) => c.AdminProfileEditComponent),
      },
      {
        path: 'genre',
        loadComponent: () =>
          import(
            '../app/features/AdminDashboard/AdminGenre/AdminGenre.component'
          ).then((c) => c.AdminGenreComponent),
      },
      {
        path: 'genre/edit/:genreId',
        loadComponent: () =>
          import(
            '../app/features/AdminDashboard/AdminGenre/GenreEdit/GenreEdit.component'
          ).then((c) => c.GenreEditComponent),
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
