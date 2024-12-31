import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  ApiError,
  Book,
  BookResponse,
  BookResponseByAuthor,
} from '../book.interface';
import { URL } from '../features/shared/constants';
import { AuthorDetailsResponse } from '../features/Auth/user.interface';
import { Rating, RatingApiResponse } from '../rating.interface';
import {
  Collection,
  CollectionApiResponse,
} from '../features/Collection/collection.interface';
import { AuthService } from '../features/Auth/auth.service';
import { Router } from '@angular/router';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  book = signal<Book | null | undefined>(null);
  books = signal<Book[] | null | undefined>(null);
  booksByAuthor = signal<Book[] | null | undefined>(null);
  searchedBooks = signal<Book[] | null>(null);
  author = signal<AuthorDetailsResponse>(null);
  collections = signal<Collection[] | null>(null);
  ratings = signal<Rating[] | null>(null);

  loading = signal(false);
  authorLoading = signal(false);
  collectionLoading = signal(false);
  ratingLoading = signal(false);

  error = signal('');
  authorError = signal('');
  collectionError = signal('');
  booksByAuthorError = signal('');
  collectionAddError = signal('');
  ratingError = signal('');

  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  dialog = inject(HlmDialogService);

  fetchBooks() {
    this.http.get<BookResponse>(`${URL}/books`).subscribe({
      next: (data: BookResponse) => {
        this.loading.set(true);
        this.books.set(data.content);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(true);
        this.error.set('Failed to load books.');
        this.loading.set(false);
        console.log(err.message);
      },
    });
  }

  // ! Done
  searchBooks(searchTerm: string): void {
    if (!searchTerm) return;

    this.loading.set(true);
    this.http
      .get<BookResponse>(`${URL}/books/by-title?title=${searchTerm}`)
      .subscribe({
        next: (response: BookResponse) => {
          this.searchedBooks.set(response.content);
          console.log('Search results:', response);
        },
        error: (error: ApiError) => {
          this.error.set(error?.message);
          console.error('Search error:', error);
        },
        complete: () => this.loading.set(false),
      });
  }

  fetchAllBooksByAuthor(id: number) {
    this.http
      .get<BookResponseByAuthor>(`${URL}/books/book-by-author/${id}`)
      .subscribe({
        next: (response: BookResponseByAuthor) => {
          this.loading.set(true);
          this.booksByAuthor.set(response.data);
        },
        error: (error: ApiError) => {
          this.booksByAuthorError.set(error.message);
        },
      });
  }

  // ! Done
  fetchBookDetails(bookId: number): void {
    this.loading.set(true);
    this.http.get<Book>(`${URL}/books/${bookId}`).subscribe({
      next: (response: Book) => {
        this.book.set(response);
        this.fetchAuthorDetail(response.author?.id);
      },
      error: (error: ApiError) => this.error.set(error.message),
      complete: () => this.loading.set(false),
    });
  }

  // ! Done
  fetchAuthorDetail(authorId: number): void {
    if (!authorId) return;
    this.authorLoading.set(true);
    this.http
      .get<AuthorDetailsResponse>(
        `${URL}/userdetail/by-authordetail/${authorId}`,
      )
      .subscribe({
        next: (response) => {
          this.author.set(response);
          console.log('author', response);
        },
        error: (error: ApiError) => this.authorError.set(error.message),
        complete: () => this.authorLoading.set(false),
      });
  }

  // !Done
  fetchCollections(): void {
    this.collectionLoading.set(true);
    this.http.get<CollectionApiResponse>(`${URL}/collections`).subscribe({
      next: (response) => this.collections.set(response.data.content),
      error: (error: ApiError) => this.collectionError.set(error.message),
      complete: () => this.collectionLoading.set(false),
    });
  }

  // !Done
  fetchRatings(bookId: number): void {
    this.ratingLoading.set(true);
    this.http
      .get<RatingApiResponse>(`${URL}/bookrating/getratings/${bookId}`)
      .subscribe({
        next: (response) => this.ratings.set(response.data),
        error: (error: ApiError) => this.ratingError.set(error.message),
        complete: () => this.ratingLoading.set(false),
      });
  }

  // !Done
  addToCollection(bookId: number, collectionId: number): void {
    this.http
      .post(`${URL}/collections/${collectionId}/books/${bookId}`, {})
      .subscribe({
        next: (response: CollectionApiResponse) => {
          toast.success('Success', { description: response.message });
        },
        error: (error: ApiError) => {
          this.collectionAddError.set(error.message);
          toast.error('Unsuccessful', { description: error.message });
        },
      });
  }

  // submitRating(userId: number, bookId: number, ratingValue: number): void {
  //   this.http
  //     .post(
  //       `${URL}/bookrating/rate?userId=${userId}&bookId=${bookId}&ratingValue=${ratingValue}`,
  //       {},
  //     )
  //     .subscribe({
  //       next: () => location.reload(),
  //       error: (error: ApiError) => console.error(error),
  //     });
  // }

  showToastSuccess(successMsg: string) {
    toast.success('Success', {
      description: successMsg,
    });
  }

  showToastDanger(errorMsg: string) {
    toast.error('Unsuccessfull', {
      description: errorMsg,
    });
  }
}
