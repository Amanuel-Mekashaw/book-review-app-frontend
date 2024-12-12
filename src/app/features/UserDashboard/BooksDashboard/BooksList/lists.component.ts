import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { BookComponent } from '../Book/list.component';
import { BooksService } from '../../../../books.service';
import { Book, BookByAuthor, BookResponse } from '../../../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

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
  imports: [BookComponent, CommonModule, LoadingSpinnerComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListsByAuthorComponent implements OnInit {
  inputBooks = input<BookByAuthor[] | null | undefined>();
  books = signal<BookByAuthor[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    console.log('Input books', this.inputBooks());
    if (this.inputBooks() !== undefined) {
      this.books.set(this.inputBooks());
    }
  }
}
