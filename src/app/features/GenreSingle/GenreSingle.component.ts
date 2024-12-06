import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { URL } from '../shared/constants';
import { ApiError, Book, BookResponse } from '../../book.interface';
import { HeroHeaderComponent } from '../shared/components/HeroHeader/HeroHeader.component';
import { Genre } from '../../genre.interface';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { BooksListsComponent } from '../Homepage/components/BooksList/lists.component';

@Component({
  selector: 'app-genre-single',
  standalone: true,
  imports: [
    HeroHeaderComponent,
    LoadingSpinnerComponent,
    CommonModule,
    BooksListsComponent,
  ],
  templateUrl: './GenreSingle.component.html',
  styleUrl: './GenreSingle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreSingleComponent implements OnInit {
  genreId = input.required<number>();

  http = inject(HttpClient);

  BooksByGenre = signal<Book[] | null>(null);
  genre = signal<Genre | null>(null);

  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.http.get<Genre>(`${URL}/genre/${this.genreId()}`).subscribe({
      next: (response: Genre) => {
        this.loading = signal(true);
        console.log(response);
        this.genre.set(response);
        this.fetchBooksByGenre();
        this.loading = signal(false);
      },
      error: (error: ApiError) => {
        console.log(error);
        this.error.set(error.message);
      },
    });
  }

  fetchBooksByGenre() {
    this.http.get<Book[]>(`${URL}/books/genre/${this.genreId()}`).subscribe({
      next: (response: Book[]) => {
        console.log(response);
        this.BooksByGenre.set(response);
      },
      error: (error: ApiError) => {
        console.log(error);
      },
    });
  }
}