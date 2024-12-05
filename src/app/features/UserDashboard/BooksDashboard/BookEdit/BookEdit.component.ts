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
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    BooksFormComponent,
    HeroHeaderComponent,
    CommonModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './BookEdit.component.html',
  styleUrl: './BookEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent implements OnInit {
  bookId = input<number>();

  http = inject(HttpClient);

  book = signal<Book | null>(null);
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.http.get<Book>(`${URL}/books/${+this.bookId()}`).subscribe({
      next: (response: Book) => {
        // console.log('Books Edit Response', response);
        this.loading.set(true);
        this.book.set(response);
        this.logShit();
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }

  logShit() {
    console.log({
      'bookId id': this.bookId(),
      'Book signal': this.book(),
      'error text': this.error(),
      'loading state': this.loading(),
    });
  }
}
