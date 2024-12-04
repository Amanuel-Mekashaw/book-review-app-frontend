import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { BooksFormComponent } from '../BooksForm/BooksForm.component';
import { HeroHeaderComponent } from '../../../shared/components/HeroHeader/HeroHeader.component';
import { HttpClient } from '@angular/common/http';
import { ApiError, Book } from '../../../../book.interface';
import { URL } from '../../../shared/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [BooksFormComponent, HeroHeaderComponent, CommonModule],
  templateUrl: './BookEdit.component.html',
  styleUrl: './BookEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent implements OnInit {
  bookId = input();

  http = inject(HttpClient);

  book = signal<Book | null | undefined>(null);
  error = signal('');
  loading = signal(true);

  ngOnInit(): void {
    this.fetchBook();
  }

  fetchBook() {
    // fetch single book
    this.http.get<Book>(`${URL}/books/${+this.bookId()}`).subscribe({
      next: (response: Book) => {
        console.log('response', response);
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
