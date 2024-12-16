import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { BookComponent } from '../Book/list.component';
import { BooksService } from '../../../../books.service';
import { Book, BookByAuthor, BookResponse } from '../../../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { NoBooksFoundComponent } from '../../../shared/components/NoElementFound/NoElementFound.component';

export type ItemProps = {
  id: number;
  title: string;
  date: number;
  description: string;
  image: string;
  link: string | undefined;
};

@Component({
  selector: 'app-books-by-author',
  standalone: true,
  imports: [
    BookComponent,
    CommonModule,
    LoadingSpinnerComponent,
    NoBooksFoundComponent,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListsByAuthorComponent implements OnInit, OnChanges {
  inputBooks = input<BookByAuthor[] | null | undefined>();
  books = signal<BookByAuthor[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    console.log('Input books', this.inputBooks());
    if (this.inputBooks() !== null) {
      this.books.set(this.inputBooks());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.books.set(this.inputBooks());
    console.log('Input books changed', this.inputBooks());
  }
}
