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

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './BookDetails.component.html',
  styleUrl: './BookDetails.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent implements OnInit {
  // activeRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  book = signal<Book | null | undefined>(null);
  error = signal('');
  loading = signal(true);

  // bookId = signal(this.activeRoute.snapshot.params['id']);

  // automatically bookId will be fetched from the url since i have enabled withComponentInputBinding()
  // in angular route provider in app.config.ts
  bookId = input.required<number>();

  isReadMe = signal(false);

  ngOnInit(): void {
    console.log('book id', this.bookId());

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

  openReadMe() {
    this.isReadMe.update((current) => !current);
  }
}
