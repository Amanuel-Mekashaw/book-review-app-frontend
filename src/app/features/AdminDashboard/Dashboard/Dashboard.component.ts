import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { Genre } from '../../../genre.interface';
import { BooksService } from '../../../services/books.service';
import { GenreService } from '../../../services/genre.service';
import { User, UsersApiResponse } from '../../Auth/user.interface';
import { LoadingStateComponent } from '../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../shared/components/ErrorState/ErrorState.component';
import { ApiError } from '../../../book.interface';
import { URL } from '../../shared/constants';
import { RouterLink } from '@angular/router';
import { UsersTable } from '../AdminUserDashboard/UsersTable/UsersTable.component';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { GenresTable } from '../AdminGenre/GenreTable/GenreTable.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HlmCardModule,
    LoadingStateComponent,
    ErrorStateComponent,
    RouterLink,
    UsersTable,
    HeroHeaderComponent,
    GenresTable,
  ],
  templateUrl: './Dashboard.component.html',
  styleUrl: './Dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnChanges {
  http = inject(HttpClient);
  bookService = inject(BooksService);

  users = signal<User[] | null>(null);
  genres = signal<Genre[] | null>(null);

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.bookService.fetchBooks();
    this.fetchGenres();
    this.fetchUsers();
    this.loading.set(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.fetchGenres();
  }

  fetchGenres() {
    this.http.get<Genre[]>(`${URL}/genre`).subscribe({
      next: (response: Genre[]) => {
        console.log('response', response);
        this.genres.set(response);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
      },
    });
  }
  fetchUsers() {
    this.http.get<UsersApiResponse>(`${URL}/auth/all`).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.users.set(response.data);
      },
      error: (error: ApiError) => {
        this.error.set(error.message);
      },
    });
  }
}
