import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from 'express';
import { ApiError, Book } from '../book.interface';
import { Genre } from '../genre.interface';
import { URL } from '../features/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  http = inject(HttpClient);
  router = inject(Router);

  genres = signal<Genre[] | null | undefined>(null);
  error = signal('');
  loading = signal(true);

  booksByGenre = signal<Book[] | null>(null);
  genre = signal<Genre | null>(null);

  bookByGenreError = signal('');
  bookByGenreLoading = signal(false);

  fetchGenres() {
    this.http.get<Genre[]>(`${URL}/genre`).subscribe({
      next: (response: Genre[]) => {
        console.log('response', response);
        this.genres.set(response);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }

  fetchSingleGenre(id: number) {
    this.http.get<Genre>(`${URL}/genre/${id}`).subscribe({
      next: (response: Genre) => {
        this.bookByGenreLoading.set(true);
        console.log(response);
        this.genre.set(response);
        this.fetchBooksByGenre(id);
        this.bookByGenreLoading.set(false);
      },
      error: (error: ApiError) => {
        console.log(error);
        this.bookByGenreError.set(error.message);
      },
    });
  }

  fetchBooksByGenre(id: number) {
    this.http.get<Book[]>(`${URL}/books/genre/${id}`).subscribe({
      next: (response: Book[]) => {
        console.log('Book By Genre', response);
        this.booksByGenre.set(response);
      },
      error: (error: ApiError) => {
        console.log(error);
      },
    });
  }

  fetchBookByGenre(id: number) {
    console.log(id);
    this.router.navigateByUrl(`/genres/${id}`);
  }
}
