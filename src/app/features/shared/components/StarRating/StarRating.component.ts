import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
  templateUrl: './StarRating.component.html',
  styleUrl: './StarRating.component.css',
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 5;
  @Input() value = 0;
  @Input() avgRating = 0;

  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [];
  hoverValue = 0;

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.stars = Array.from(
      { length: this.max - this.min + 1 },
      (_, i) => this.min + i,
    );
  }

  writeValue(value: number): void {
    this.value = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onStarClick(rating: number): void {
    this.value = rating;
    this.onChange(this.value);
    this.ratingChange.emit(this.value);
  }

  onHover(rating: number): void {
    this.hoverValue = rating;
  }
}
