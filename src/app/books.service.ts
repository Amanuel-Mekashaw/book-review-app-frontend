import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BookResponse } from './book.interface';
import { URL } from './features/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${URL}/books`);
  }
}
