import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { HeroHeaderComponent } from '../../../shared/components/HeroHeader/HeroHeader.component';
import { BooksFormWithFileComponent } from '../../../UserDashboard/BooksDashboard/BooksFormWithFile/BooksFormWithFile.component';
import { BooksService } from '../../../../services/books.service';
import { ApiError, Book } from '../../../../book.interface';
import { HttpClient } from '@angular/common/http';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';
import { URL } from '../../../shared/constants';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    HeroHeaderComponent,
    BooksFormWithFileComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './BookEdit.component.html',
  styleUrl: './BookEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent implements OnInit {
  bookId = input.required<number>();

  bookService = inject(BooksService);
  http = inject(HttpClient);

  book = signal<Book | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.fetchBook(this.bookId());
  }

  fetchBook(id: number) {
    this.http.get<Book>(`${URL}/books/${id}`).subscribe({
      next: (response: Book) => {
        this.loading.set(true);
        this.book.set(response);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }
}
