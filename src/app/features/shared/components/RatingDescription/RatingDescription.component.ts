import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Rating } from '../../../../rating.interface';
import { CommonModule } from '@angular/common';

import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';

@Component({
  selector: 'app-rating-description',
  standalone: true,
  imports: [
    CommonModule,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogHeaderComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
  ],
  templateUrl: './RatingDescription.component.html',
  styleUrl: './RatingDescription.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingDescriptionComponent implements OnInit, OnChanges {
  @Input() ratings: Rating[] | null = [];

  ratingInfo = signal<number[] | []>([]);
  numberOfStar = signal<number[] | []>([]);

  commentNumberOfStar = signal<number>(0);

  isWriteReview = signal<boolean>(false);

  ngOnInit(): void {
    console.log('Ratings recieved to comments', this.ratings);
    this.ratingInfo.set(
      Array.from(Array(this.ratings?.length).keys())
        .map((num) => num + 1)
        .reverse(),
    );
    this.numberOfStar.set(
      Array.from(Array(10).keys())
        .map((num) => num + 1)
        .reverse(),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ratings']) {
      this.ratingInfo.set(
        Array.from(Array(this.ratings?.length).keys())
          .map((num) => num + 1)
          .reverse(),
      );
    }
  }

  getRatingCount(num: number): number {
    return this.ratings?.filter((rating) => rating?.ratingValue === num).length;
  }

  getRatingValue(ratingValue) {
    return this.ratings?.filter((rating) => rating?.ratingValue === ratingValue)
      .length;
  }

  getArrayFromNumber(length: number): number[] {
    if (!Number.isInteger(length) || length <= 0) {
      return []; // Return an empty array for invalid lengths
    }
    return new Array(length).fill(0); // Fill to prevent sparse arrays
  }

  getAverageRating(ratings: Rating[]): number {
    if (!ratings || ratings.length === 0) {
      return 0; // Default to 0 if there are no ratings
    }
    const total = ratings.reduce(
      (acc, current) => acc + (current?.ratingValue || 0),
      0,
    );
    return Math.round(total / ratings.length); // Return rounded integer for safe array length
  }

  findRatingByValue(ratings: Rating[], num: number): Rating {
    return ratings.find((value) => value?.ratingValue === num);
  }

  openWriteReview(): void {
    this.isWriteReview.set(true);
  }

  displayByRatingValue(num: number, ratings: Rating[]): Rating[] {
    // logic here

    const rating = ratings.filter((r) => Number(r?.ratingValue) === num);
    console.log({ Rating: rating, Ratings: ratings, Num: num });
    return rating;
  }
}
