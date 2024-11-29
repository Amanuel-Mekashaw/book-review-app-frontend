import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { BookComponent } from '../Book/list.component';
import { BooksService } from '../../../../books.service';
import { Book, BookResponse } from '../../../../book_interface';
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
  selector: 'app-lists',
  standalone: true,
  imports: [BookComponent, CommonModule, LoadingSpinnerComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListsComponent implements OnInit {
  books = signal<Book[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe({
      next: (data: BookResponse) => {
        this.books.set(data.content);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load books.');
        this.loading.set(false);
        console.log(err.message);
      },
    });
  }
}
