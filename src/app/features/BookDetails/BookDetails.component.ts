import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { URL } from '../shared/constants';
import { Book } from '../../book.interface';
import { ApiError } from '../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';
import { AuthorDetails, AuthorDetailsResponse } from '../Auth/user.interface';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';
import { Genre } from '../../genre.interface';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmAvatarImageDirective,
    HlmButtonDirective,
  ],
  templateUrl: './BookDetails.component.html',
  styleUrl: './BookDetails.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent implements OnInit {
  // activeRoute = inject(ActivatedRoute);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  book = signal<Book | null | undefined>(null);
  author = signal<AuthorDetailsResponse>(null);
  genre = signal<Genre[] | null>(null);
  error = signal('');
  authorError = signal('');
  loading = signal(true);
  authorLoading = signal(true);

  // bookId = signal(this.activeRoute.snapshot.params['id']);

  // automatically bookId will be fetched from the url since i have enabled withComponentInputBinding()
  // in angular route provider in app.config.ts
  bookId = input.required<number>();

  isReadMe = signal(false);

  ngOnInit(): void {
    // console.log(
    //   'authorId from LS',
    //   this.authService.currentUserDetail()?.data?.user?.id,
    // );
    // fetch book detail
    this.http.get<Book>(`${URL}/books/${+this.bookId()}`).subscribe({
      next: (response: Book) => {
        console.log('response', response);
        this.book.set(response);
        this.loading.set(false);

        this.fetchAuthorDetail();
        this.fetchGenre();
      },
      error: (error: ApiError) => {
        // console.log('error', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });

    console.log('id', this.book()?.author?.id);
  }

  fetchAuthorDetail() {
    // fetch book genre

    this.http
      .get<AuthorDetailsResponse>(
        `${URL}/userdetail/by-authordetail/${this.book()?.author?.id}`,
      )
      .subscribe({
        next: (response: AuthorDetailsResponse) => {
          this.authorLoading.set(true);
          console.log('authordetail', response);
          this.author.set(response);
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
  }

  fetchGenre() {
    // fetch book author
    // fetch book genre
    this.book()?.genres.map((genre, index) => {
      this.http.get<Genre>(`${URL}/genre/${index}`).subscribe({
        next: (response: Genre) => {
          this.authorLoading.set(true);
          console.log('authordetail', response);
          this.genre.set([response]);
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
    });
  }

  openReadMe() {
    this.isReadMe.update((current) => !current);
  }

  editBook(id: number) {
    this.router.navigateByUrl(`/dashboard/books/edit/${id}`);
  }
}
