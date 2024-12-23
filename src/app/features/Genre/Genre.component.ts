import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ApiError } from '../../book.interface';
import { CommonModule } from '@angular/common';
import { URL } from '../shared/constants';
import { Genre } from '../../genre.interface';
import { Router } from '@angular/router';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './Genre.component.html',
  styleUrl: './Genre.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreComponent {
  http = inject(HttpClient);
  router = inject(Router);

  genres = signal<Genre[] | null | undefined>(null);
  error = signal('');
  loading = signal(true);

  isReadMe = signal(false);

  ngOnInit(): void {
    this.http.get<Genre[]>(`${URL}/genre`).subscribe({
      next: (response: Genre[]) => {
        console.log('response', response);
        this.genres.set(response);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }

  fetchBookByGenre(id: number) {
    console.log(id);
    this.router.navigateByUrl(`/genres/${id}`);
  }
}
