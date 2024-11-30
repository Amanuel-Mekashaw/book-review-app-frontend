import { Routes } from '@angular/router';
import { LoginComponent } from './features/Auth/login/login.component';
import { RegisterComponent } from './features/Auth/register/register.component';
import { LayoutComponent } from './features/shared/components/layout/layout.component';
import { BooksComponent } from './features/books/books.component';
import { BookDetailsComponent } from './features/BookDetails/BookDetails.component';
import { GenreComponent } from './features/Genre/Genre.component';
import { CollectionComponent } from './features/Collection/Collection.component';

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
    component: LayoutComponent,
    children: [
      {
        path: 'books',
        title: 'books page',
        component: BooksComponent,
      },
      { path: 'books/:id', component: BookDetailsComponent },

      {
        path: 'genres',
        component: GenreComponent,
      },
      {
        path: 'genres',
        title: 'genre page',
        component: GenreComponent,
      },
      {
        path: 'collections',
        title: 'Collection page',
        component: CollectionComponent,
      },
    ],
  },
];
