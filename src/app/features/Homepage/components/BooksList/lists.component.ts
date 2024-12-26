import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { BookComponent } from '../Book/list.component';
import { BooksService } from '../../../../services/books.service';
import { Book, BookResponse } from '../../../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { NoBooksFoundComponent } from '../../../shared/components/NoElementFound/NoElementFound.component';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../../shared/constants';

export type ItemProps = {
  id: number;
  title: string;
  date: number;
  description: string;
  image: string;
  link: string | undefined;
};

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    BookComponent,
    CommonModule,
    NoBooksFoundComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListsComponent implements OnInit, OnChanges {
  @Input() remove: boolean;
  @Input() collectionId: number;
  inputBooks = input<Book[] | null | undefined>();
  books = signal<Book[]>(null);

  http = inject(HttpClient);

  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    console.log('Input books', this.inputBooks());
    if (this.inputBooks() !== undefined) {
      this.books.set(this.inputBooks());
      return;
    }
    this.fetchBooks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Input books change', this.inputBooks());
    this.books.set(this.inputBooks());
  }

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
}
