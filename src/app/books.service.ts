import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BookResponse } from './book_interface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  URL = 'http://localhost:9191/api/v1';
  token =
    'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhemViQGdtYWlsLmNvbSIsImlhdCI6MTczMjc3Njc0MywiZXhwIjoxNzMzMjA4NzQzfQ.iw98aJb3sj2Pom5Edxl5pcoMkf808lWySSEhGmvhA6Y';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<BookResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http
      .get<BookResponse>(`${this.URL}/books`, { headers })
      .pipe(tap((data) => console.log('Service Response:', data)));
  }
}
