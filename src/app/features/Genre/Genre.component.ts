import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Genre } from '../../book.interface';
import { HttpClient } from '@angular/common/http';
import { GenreApiResponse } from './genre.interface';
import { ApiError } from '../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { URL } from '../shared/constants';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './Genre.component.html',
  styleUrl: './Genre.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreComponent {
  http = inject(HttpClient);

  genres = signal<Genre[] | null | undefined>(null);
  error = signal('');
  loading = signal(true);

  isReadMe = signal(false);

  ngOnInit(): void {
    this.http.get<GenreApiResponse>(`${URL}/genre`).subscribe({
      next: (response: GenreApiResponse) => {
        console.log('response', response);
        this.genres.set(response.content);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }
}
