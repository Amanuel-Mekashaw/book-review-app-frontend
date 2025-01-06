import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../shared/constants';
import { ApiError } from '../../../book.interface';
import { AuthService } from '../../Auth/auth.service';
import { LoadingStateComponent } from '../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../shared/components/ErrorState/ErrorState.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Rating, RatingApiResponse } from '../../../rating.interface';
import { CommentComponent } from '../../shared/components/Comment/Comment.component';
import { NoBooksFoundComponent } from '../../shared/components/NoElementFound/NoElementFound.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ratings-dashboard',
  standalone: true,
  imports: [
    HeroHeaderComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    NoBooksFoundComponent,
  ],
  templateUrl: './RatingsDashboard.component.html',
  styleUrl: './RatingsDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingsDashboardComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);

  starRatingValue = signal<number>(11);

  ratings = signal<Rating[] | null>(null);
  filteredRating = computed(() => {
    if (this.starRatingValue() !== null && this.starRatingValue() !== 11) {
      return this.ratings().filter(
        (rating) => rating?.ratingValue === this.starRatingValue(),
      );
    }
    return this.starRatingValue() === 11 ? this.ratings() : null;
  });
  loading = signal(false);
  error = signal('');

  stars = Array.from(Array(10).keys()).map((arr) => arr + 1);

  userId = signal<number>(this.authService.currentUserSignal()?.data?.user?.id);

  ngOnInit(): void {
    this.fetchRatingByUser(this.userId());
  }

  fetchRatingByUser(userId: number) {
    this.loading.set(true);
    this.http
      .get<RatingApiResponse>(`${URL}/bookrating/getuserratings/${userId}`)
      .subscribe({
        next: (response: RatingApiResponse) => {
          this.ratings.set(response.data);
          this.loading.set(false);
          console.log(response);
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
          console.log(error);
        },
      });
  }

  getArrayFromNumber(length: number): any[] {
    return new Array(length);
  }

  onChangeRating(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue =
      selectElement.value === null ? null : parseInt(selectElement.value, 10);
    this.starRatingValue.set(selectedValue);

    console.log('value', selectedValue);
  }
}
