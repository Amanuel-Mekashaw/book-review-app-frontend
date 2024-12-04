import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthError, AuthorDetailsResponse } from '../../../Auth/user.interface';
import { AuthService } from '../../../Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { URL } from '../../../shared/constants';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { Book, BookRequest } from '../../../../book.interface';
import { GenreApiResponse } from '../../../Genre/genre.interface';
import { Genre } from '../../../../genre.interface';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { HlmSelectDirective } from '../../../../../lib/ui-select-helm/src/lib/hlm-select.directive';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HlmToasterComponent,
    HlmInputDirective,
    HlmButtonModule,
    LoadingSpinnerComponent,
    BrnSelectImports,
    HlmSelectModule,
  ],
  templateUrl: './BooksForm.component.html',
  styleUrl: './BooksForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFormComponent {
  @Input() book!: BookRequest;

  bookId = input<number | null>();

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  genres = signal<Genre[] | null>([]);

  bookForm: FormGroup;
  message = signal('');
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    console.log('bookId', this.bookId());

    // form initializing
    this.bookForm = this.formBuilder.group({
      id: new FormControl(this.book?.id | 1, Validators.required),
      title: new FormControl(this.book?.title || '', Validators.required),
      isbn: new FormControl(this.book?.isbn || '', Validators.required),
      description: new FormControl(this.book?.description || ''),
      coverImage: new FormControl(this.book?.coverImage),
      authorId: [
        this.authService.currentUserSignal().data.user.id,
        Validators.required,
      ],
      publishedYear: new FormControl(
        this.book?.publishedYear || '',
        Validators.required,
      ),
      publisher: new FormControl(
        this.book?.publisher || '',
        Validators.required,
      ),
      pages: new FormControl(this.book?.pages || '', Validators.required),
      language: new FormControl(this.book?.language || '', Validators.required),
      createdAt: new FormControl(
        this.book?.createdAt || new Date().toISOString(),
        Validators.required,
      ),
      updatedAt: new FormControl(new Date().toISOString(), Validators.required),
      genreIds: this.formBuilder.array(this.book?.genreIds || []),
    });

    // retrieve genre

    this.http.get<GenreApiResponse>(`${URL}/genre`).subscribe({
      next: (response: GenreApiResponse) => {
        this.loading.set(true);
        console.log('response', response);
        this.genres.set(response.content);
        this.loading.set(false);
      },
      error: (error: AuthError) => {
        this.errorResponse(error);
      },
    });
  }

  // Get the FormArray for socialLinks
  get genreIds(): FormArray {
    return this.bookForm.get('genreIds') as FormArray;
  }

  // Add a new social link to the FormArray
  addGenreId(link: string = ''): void {
    this.genreIds.push(this.formBuilder.control(link, [Validators.required]));
  }

  // Remove a social link from the FormArray
  removeGenreId(index: number): void {
    this.genreIds.removeAt(index);
  }

  nextResponse(response: AuthorDetailsResponse) {
    console.log('response', response);
    this.message.set(response.message);
    this.authService.currentUserDetail.set(response);
    this.showToastSuccess();
  }

  errorResponse(error: AuthError) {
    console.log('error', error);
    this.error.set(error.message);
    this.showToastDanger();
  }

  onSubmit() {
    console.log(this.bookForm.value);
    if (this.bookForm.valid && this.book) {
      this.http
        .put<AuthorDetailsResponse>(
          `${URL}/books/${this.book?.id}`,
          this.bookForm.getRawValue(),
        )
        .subscribe({
          next: (response: AuthorDetailsResponse) => {
            this.nextResponse(response);
          },
          error: (error: AuthError) => {
            this.errorResponse(error);
          },
        });
    }

    if (this.bookForm.valid && !this.book) {
      this.http
        .post<AuthorDetailsResponse>(
          `${URL}/books`,
          this.bookForm.getRawValue(),
        )
        .subscribe({
          next: (response: AuthorDetailsResponse) => {
            this.nextResponse(response);
          },
          error: (error: AuthError) => {
            this.errorResponse(error);
          },
        });
    }
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
