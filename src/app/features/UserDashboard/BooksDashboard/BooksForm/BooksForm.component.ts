import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
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
import { Book } from '../../../../book.interface';
import { GenreApiResponse } from '../../../Genre/genre.interface';
import { Genre } from '../../../../genre.interface';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
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
export class BooksFormComponent implements OnInit, OnChanges {
  @Input() bookRecieved: Book;

  bookId = input<number | null>();

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  genres = signal<Genre[] | null>([]);
  book = signal<Book | null>(null);

  bookForm: FormGroup;
  message = signal('');
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.initializeForm();
    // retrieve genre
    this.http.get<Genre[]>(`${URL}/genre`).subscribe({
      next: (response: Genre[]) => {
        this.loading.set(true);
        // console.log('Genre', response);
        this.genres.set(response);
        this.book.set(this.bookRecieved);
        this.loading.set(false);
        this.logShit();
      },
      error: (error: AuthError) => {
        this.errorResponse(error);
      },
    });
  }

  ngOnChanges(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    // form initializing
    this.bookForm = this.formBuilder.group({
      id: new FormControl(this.bookRecieved?.id | 0, [Validators.required]),
      title: new FormControl(this.bookRecieved?.title || '', [
        Validators.required,
      ]),
      isbn: new FormControl(this.bookRecieved?.isbn || '', [
        Validators.required,
      ]),
      description: new FormControl(this.bookRecieved?.description || ''),
      coverImage: new FormControl(this.bookRecieved?.coverImage),
      authorId: [
        this.authService.currentUserSignal().data.user.id,
        [Validators.required],
      ],
      publishedYear: new FormControl(this.bookRecieved?.publishedYear || '', [
        Validators.required,
      ]),
      publisher: new FormControl(this.bookRecieved?.publisher || '', [
        Validators.required,
      ]),
      pages: new FormControl(this.bookRecieved?.pages || '', [
        Validators.required,
      ]),
      language: new FormControl(this.bookRecieved?.language || '', [
        Validators.required,
      ]),
      createdAt: new FormControl(
        this.bookRecieved?.createdAt || new Date().toISOString(),
        [Validators.required],
      ),
      updatedAt: new FormControl(new Date().toISOString(), [
        Validators.required,
      ]),
      genreIds: this.formBuilder.array(this.bookRecieved?.genres || []),
    });
  }

  logShit() {
    console.log({
      'book id': this.bookId(),
      'Book revieved id': this.bookRecieved,
      'Main book': this.book(),
      'error state': this.error(),
      'loading state': this.loading(),
    });
  }

  // Get the FormArray for socialLinks
  get genreIds(): FormArray {
    return this.bookForm.get('genreIds') as FormArray;
  }

  // Add a new social link to the FormArray
  addGenreId(genre: string = ''): void {
    this.genreIds.push(this.formBuilder.control(genre, [Validators.required]));
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
    if (this.bookForm.valid && this.bookRecieved) {
      this.http
        .put<AuthorDetailsResponse>(
          `${URL}/books/${this.bookId()}`,
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

    if (this.bookForm.valid && !this.bookRecieved) {
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
