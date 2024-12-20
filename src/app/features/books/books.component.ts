import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BooksListsComponent } from '../Homepage/components/BooksList/lists.component';
import { HlmSelectModule } from '../../../lib/ui-select-helm/src/index';
import { HlmSelectTriggerComponent } from '../../../lib/ui-select-helm/src/lib/hlm-select-trigger.component';
import { AuthService } from '../Auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiError, Book, BookResponse } from '../../book.interface';
import { URL } from '../shared/constants';
import { HeroHeaderComponent } from '../shared/components/HeroHeader/HeroHeader.component';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';
import { AuthorDetailsResponse } from '../Auth/user.interface';
import { NoBooksFoundComponent } from '../shared/components/NoElementFound/NoElementFound.component';
import { CommentComponent } from '../shared/components/Comment/Comment.component';

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
    CommentComponent,
  ],
  providers: [BooksComponent],
  standalone: true,
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);

  books = signal<Book[] | null>(null);
  loading = signal(false);
  error = signal<string>('');

  author = signal(null);
  authorLoading = signal(false);
  authorError = signal('');

  searchTerm: string = '';

  ngOnInit(): void {
    // console.log('from books', this.authService.currentUserSignal());
    if (this.authService.currentUserSignal() === null) {
      this.authService.currentUserSignal.set(
        JSON.parse(atob(localStorage.getItem('user'))),
      );
    }

    this.fetchAuthorDetail(
      this.authService.currentUserSignal()?.data?.user?.id,
    );
    if (this.authService.currentUserDetail() === null) {
      this.router.navigateByUrl('/dashboard/profile');
    } else {
      this.router.navigateByUrl('/books');
    }
  }

  fetchAuthorDetail(id: number) {
    this.http
      .get<AuthorDetailsResponse>(`${URL}/userdetail/by-authordetail/${id}`)
      .subscribe({
        next: (response: AuthorDetailsResponse) => {
          this.authorLoading.set(true);
          console.log('authordetail', response);
          this.author.set(response);
          localStorage.setItem('userDetail', btoa(JSON.stringify(response)));
          this.authService.currentUserDetail.set(response);
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
  }

  searchBooks() {
    if (this.searchTerm) {
      // Navigate to the URL with the search parameter
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { title: this.searchTerm },
        queryParamsHandling: 'merge',
      });

      // Fetch the data from the backend
      this.http
        .get<BookResponse>(`${URL}/books/by-title?title=${this.searchTerm}`)
        .subscribe({
          next: (response: BookResponse) => {
            this.loading.set(true);
            this.books.set(response.content);
            console.log(response);

            this.loading.set(false);
          },
          error: (error: ApiError) => {
            this.error.set(error?.message);
            console.log(error);
          },
        });
    }
  }
}
