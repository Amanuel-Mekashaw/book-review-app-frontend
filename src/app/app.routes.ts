import { Routes } from '@angular/router';
import { LoginComponent } from './features/Auth/login/login.component';
import { RegisterComponent } from './features/Auth/register/register.component';
import { LayoutComponent } from './features/shared/components/layout/layout.component';
import { AppComponent } from './app.component';
import { BooksComponent } from './features/books/books.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'login page',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'register page',
  },
  {
    path: '',
    redirectTo: 'login',

    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'books',
        title: 'books page',
        component: BooksComponent,
      },
      // {
      //   path: 'genre',
      //   title: 'genre page',
      // },
    ],
  },
];
