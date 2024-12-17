import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { HeroHeaderComponent } from '../../../shared/components/HeroHeader/HeroHeader.component';
import { ProfileFormComponent } from '../../../UserDashboard/GenreDashboard/GenreForm/GenreForm.component';
import { Genre } from '../../../../genre.interface';
import { GenrePostResponse } from '../../../Genre/genre.interface';
import { HttpClient } from '@angular/common/http';
import { ApiError } from '../../../../book.interface';
import { URL } from '../../../shared/constants';

@Component({
  selector: 'app-genre-edit',
  standalone: true,
  imports: [HeroHeaderComponent, ProfileFormComponent],
  templateUrl: './GenreEdit.component.html',
  styleUrl: './GenreEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreEditComponent implements OnInit {
  genreId = input.required<number>();

  http = inject(HttpClient);

  genre = signal<Genre | null>(null);
  message = signal('');
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    console.log('genre id is', this.genreId());
    // fetch genre
    this.fetchGenre(+this.genreId());
  }

  fetchGenre(id: number) {
    this.http.get<Genre>(`${URL}/genre/${id}`).subscribe({
      next: (response: Genre) => {
        this.loading.set(true);
        console.log('genre recieved', response);
        this.genre.set(response);
        this.loading.set(false);
        // this.fetchGenre();
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
      },
    });
  }
}
