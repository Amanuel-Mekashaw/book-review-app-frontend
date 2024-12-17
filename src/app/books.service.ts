import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookResponse } from './book.interface';
import { URL } from './features/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  http = inject(HttpClient);

  getBooks(): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${URL}/books`);
  }
  getBookDetail(id: number): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${URL}/books/${id}`);
  }

  getGenres(id: number) {}
}
