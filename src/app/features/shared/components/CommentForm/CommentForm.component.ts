import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Rating } from '../../../../rating.interface';
import { AuthService } from '../../../Auth/auth.service';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { StarRatingComponent } from '../StarRating/StarRating.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiError } from '../../../../book.interface';
import { URL } from '../../constants';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    HlmInputDirective,
    HlmButtonDirective,
    StarRatingComponent,
    ReactiveFormsModule,
    FormsModule,
    HlmToasterComponent,
  ],
  templateUrl: './CommentForm.component.html',
  styleUrl: './CommentForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent implements OnInit, OnChanges {
  @Input() ratings: Rating[];

  @Input() min = 1;
  @Input() max = 5;
  @Input() value = 0;
  @Input() avgRating = 0;
  @Input() bookId: number;
  @Input() userId: number;

  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  http = inject(HttpClient);

  ratingForm: FormGroup;
  isRatingChecked = signal(false);
  maxRating = signal(10);
  error = signal('');
  message = signal('');

  ngOnInit(): void {
    console.log('Ratings recieved to comments', this.ratings);
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.ratingForm = this.formBuilder.group({
      ratingValue: new FormControl(0, [Validators.required]), // Default rating
      comment: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      bookId: new FormControl(this.bookId),
      userId: new FormControl(this.userId),
    });
  }

  onRatingChange(ratingValue: number) {
    console.log('Rating value', ratingValue);
    this.ratingForm.get('ratingValue').setValue(ratingValue);
  }

  onSubmit() {
    this.onRatingChange(this.ratingForm.get('ratingValue').value);
    // console.log('Rating form', this.ratingForm.getRawValue());
    if (this.ratingForm.invalid) {
      return;
    }
    // console.log({ comment, rating, bookId, userId });
    console.log('Rating form', this.ratingForm.getRawValue());

    this.http
      .post(`${URL}/bookrating/ratecomment`, this.ratingForm.getRawValue())
      .subscribe({
        next: (response) => {
          console.log(response);
          this.message.set('Comment added successfully');
          this.showToastSuccess();
        },
        error: (error: ApiError) => {
          console.log(error);
          this.error.set(error.message);
          this.showToastDanger();
        },
      });
  }

  showToastSuccess() {
    toast.success('Success', {
      description: this.message(),
    });
  }

  showToastDanger() {
    toast.error('Unsuccessfull', {
      description: this.error(),
    });
  }
}
