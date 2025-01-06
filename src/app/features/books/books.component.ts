import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '../../../lib/ui-select-helm/src/index';
import { HlmSelectTriggerComponent } from '../../../lib/ui-select-helm/src/lib/hlm-select-trigger.component';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BooksListsComponent } from '../Homepage/components/BooksList/lists.component';
import { AuthService } from '../Auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ApiError,
  Book,
  BookRequest,
  BookResponse,
  BookResponseByPublishedYear,
} from '../../book.interface';
import { URL } from '../shared/constants';
import { HeroHeaderComponent } from '../shared/components/HeroHeader/HeroHeader.component';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';
import { NoBooksFoundComponent } from '../shared/components/NoElementFound/NoElementFound.component';
import { BooksService } from '../../services/books.service';
import { Genre } from '../../genre.interface';

import { language } from '../shared/constants';

@Component({
  imports: [
    HlmSelectImports,
    HlmButtonDirective,
    BooksListsComponent,
    HlmSelectModule,
    HlmSelectTriggerComponent,
    BrnSelectImports,
    HlmInputDirective,
    FormsModule,
    CommonModule,
    HeroHeaderComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    NoBooksFoundComponent,
  ],
  providers: [],
  standalone: true,
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  authService = inject(AuthService);
  bookService = inject(BooksService);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);

  languages = signal(language);
  years = Array.from({ length: 2030 - 1920 + 1 }, (_, index) => 1920 + index);

  genres = signal<Genre[] | null>(null);
  loading = signal(false);
  error = signal<string>('');

  books = signal<Book[] | null>(null);
  booksByPublishedYear = signal<Book[] | null>(null);
  bookByLanguage = signal<Book[] | null>(null);

  // Computed signal for the current books to display
  currentBooks = computed(() => {
    if (this.books()) return this.books();
    if (this.booksByPublishedYear()) return this.booksByPublishedYear();
    if (this.bookService.searchedBooks())
      return this.bookService.searchedBooks();
    if (this.bookByLanguage()) return this.bookByLanguage();
    return null;
  });

  author = signal(null);
  authorLoading = signal(false);
  authorError = signal('');

  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.authService.initializeUser();
    this.authService.navigateBasedOnUserDetail();

    this.bookService.fetchAuthorDetail(
      this.authService.currentUserSignal()?.data?.user?.id,
    );

    this.fetchGenres();
    this.fetchBooks(this.booksByPublishedYear);
  }

  fetchBooks(booksByPublishedYear: WritableSignal<Book[] | null>) {
    this.loading.set(true);
    this.http.get<BookResponse>(`${URL}/books`).subscribe({
      next: (data: BookResponse) => {
        this.books.set(data.content);
        booksByPublishedYear.set(null);
        this.bookByLanguage.set(null);
      },
      error: (err) => {
        this.loading.set(true);
        this.error.set('Failed to load books.');
        this.loading.set(false);
        console.log(err.message);
      },
      complete: () => this.loading.set(false),
    });
  }

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

  fetchPublishedYear(year: number) {
    this.http
      .get<BookResponseByPublishedYear>(
        `${URL}/books/by-publishedyear?publishedYear=${year}`,
      )
      .subscribe({
        next: (response: BookResponseByPublishedYear) => {
          console.log('response', response.data);
          this.booksByPublishedYear.set(response.data);
          this.books.set(null);
          this.bookByLanguage.set(null);
          this.searchTerm.set(null);
          this.loading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.error.set(error.message);
          this.loading.set(false);
        },
      });
  }

  fetchLanguage(language: string) {
    this.http
      .get<BookResponseByPublishedYear>(
        `${URL}/books/by-language?language=${language}`,
      )
      .subscribe({
        next: (response: BookResponseByPublishedYear) => {
          console.log('response', response.data);
          this.bookByLanguage.set(response.data);
          this.books.set(null);
          this.bookService.searchedBooks.set(null);
          this.booksByPublishedYear.set(null);
          this.searchTerm.set(null);
          this.loading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.error.set(error.message);
          this.loading.set(false);
        },
      });
  }

  searchByGenre(id: number) {
    this.router.navigateByUrl(`/genres/${id}`);
  }
}
