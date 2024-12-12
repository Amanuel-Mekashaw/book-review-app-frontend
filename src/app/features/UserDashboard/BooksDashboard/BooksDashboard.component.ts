import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { BooksFormComponent } from './BooksForm/BooksForm.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ApiError,
  Book,
  BookByAuthor,
  BookResponse,
  BookResponseByAuthor,
} from '../../../book.interface';
import { URL } from '../../shared/constants';
import { AuthorDetailsResponse } from '../../Auth/user.interface';
import { AuthService } from '../../Auth/auth.service';
import { BooksListsComponent } from '../../Homepage/components/BooksList/lists.component';
import { BooksListsByAuthorComponent } from './BooksList/lists.component';

@Component({
  selector: 'app-books-dashboard',
  standalone: true,
  imports: [
    HeroHeaderComponent,
    BooksFormComponent,
    HlmButtonDirective,
    CommonModule,
    BooksListsComponent,
    BooksListsByAuthorComponent,
  ],
  templateUrl: './BooksDashboard.component.html',
  styleUrl: './BooksDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksDashboardComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);

  isAddBookOpen = signal(false);
  books = signal<BookByAuthor[] | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    console.log(this.authService.currentUserSignal()?.data?.user?.id);

    if (this.authService.currentUserSignal() !== null) {
      this.fetchAllBooksByAuthor(
        this.authService.currentUserSignal()?.data?.user?.id,
      );
    }
  }

  fetchAllBooksByAuthor(id: number) {
    this.http
      .get<BookResponseByAuthor>(`${URL}/books/book-by-author/${id}`)
      .subscribe({
        next: (response: BookResponseByAuthor) => {
          this.loading.set(true);
          this.books.set(response.data);
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
        },
      });
  }

  addBook() {
    this.isAddBookOpen.update((curr) => !curr);
  }
}
