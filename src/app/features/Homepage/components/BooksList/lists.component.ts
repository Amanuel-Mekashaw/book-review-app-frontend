import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { BookComponent } from '../Book/list.component';
import { BooksService } from '../../../../books.service';
import { Book, BookResponse } from '../../../../book.interface';
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
  selector: 'app-books',
  standalone: true,
  imports: [BookComponent, CommonModule, LoadingSpinnerComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListsComponent implements OnInit {
  inputBooks = input<Book[]>();
  books = signal<Book[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    console.log(this.inputBooks());
    if (this.inputBooks() !== undefined) {
      this.books.set(this.inputBooks());
    } else {
      this.fetchBooks();
    }
  }

  fetchBooks() {
    this.booksService.getBooks().subscribe({
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
