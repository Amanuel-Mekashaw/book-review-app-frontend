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
import { Router, RouterLink } from '@angular/router';
import { Genre } from '../../genre.interface';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { GenreAddModalComponent } from './GenreAddModal/GenreAddModal.component';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';

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
    RouterLink,
    GenreAddModalComponent,
    LoadingStateComponent,
    ErrorStateComponent,
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
  dialog = inject(HlmDialogService);

  book = signal<Book | null | undefined>(null);
  author = signal<AuthorDetailsResponse>(null);
  error = signal('');
  authorError = signal('');
  loading = signal(false);
  authorLoading = signal(true);

  // bookId = signal(this.activeRoute.snapshot.params['id']);

  // automatically bookId will be fetched from the url since i have enabled withComponentInputBinding()
  // in angular route provider in app.config.ts
  bookId = input.required<number>();

  isReadMe = signal(false);

  ngOnInit(): void {
    console.log('from book details', this.authService.currentUserSignal());
    console.log(
      'from book details user detail',
      this.authService.currentUserDetail(),
    );

    if (this.authService.currentUserDetail() === null) {
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
      );
    }
    console.log(
      'from book details user detail updated',
      this.authService.currentUserDetail(),
    );

    // fetch book detail
    this.http.get<Book>(`${URL}/books/${+this.bookId()}`).subscribe({
      next: (response: Book) => {
        this.loading.set(true);
        console.log('Books recieved', response);
        this.book.set(response);
        this.loading.set(false);
        this.fetchAuthorDetail();
        // this.fetchGenre();
      },
      error: (error: ApiError) => {
        // console.log('error', error);
        this.error.set(error.message);
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

  openReadMe() {
    this.isReadMe.update((current) => !current);
  }

  editBook(id: number) {
    this.router.navigateByUrl(`/dashboard/books/edit/${id}`);
  }

  onModalOpen() {
    this.dialog.open(GenreAddModalComponent, {
      closeOnBackdropClick: true,
    });
  }
}
