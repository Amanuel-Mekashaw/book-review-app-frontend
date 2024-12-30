import { CommonModule, NgOptimizedImage } from '@angular/common';
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
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthError, AuthorDetailsResponse } from '../../../Auth/user.interface';
import { AuthService } from '../../../Auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  selector: 'app-book-form-with-file',
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
  templateUrl: './BooksFormWithFile.component.html',
  styleUrl: './BooksFormWithFile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFormWithFileComponent implements OnInit, OnChanges {
  @Input() bookRecieved: Book;

  bookId = input<number | null>();

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  genres = signal<Genre[] | null>([]);
  book = signal<Book | null>(null);

  bookForm: FormGroup;
  selectedFile: File | null = null;
  message = signal('');
  loading = signal(false);
  error = signal('');
  bookCoverError = signal('');

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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
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
        Validators.min(1),
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
      genreIds: this.formBuilder.array(
        Array.from(new Set(this.bookRecieved?.genres.map((g) => g.id) || [])),
        [Validators.required],
      ),
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

  // checks if array contains duplicate value
  noDuplicatesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && Array.isArray(control.value)) {
        const uniqueValues = new Set(control.value);
        if (uniqueValues.size !== control.value.length) {
          return {
            duplicates: {
              message: 'The array contains duplicate values.',
            },
          }; // Return a message with the error
        }
      }
      return null; // No error if no duplicates
    };
  }

  // Get the FormArray for socialLinks
  get genreIds(): FormArray {
    return this.bookForm.get('genreIds') as FormArray;
  }

  // Add a new social link to the FormArray
  addGenreId(genre: string = ''): void {
    // Add genre to the FormArray if it's not already in the array
    const genreControl = this.formBuilder.control(genre, [Validators.required]);

    // Push to the FormArray
    this.genreIds.push(genreControl);

    // Apply the noDuplicatesValidator to the entire FormArray to check for duplicates
    this.genreIds.setValidators([this.noDuplicatesValidator()]);
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
    // this.bookForm.reset();
    this.selectedFile = null;
  }

  errorResponse(error: AuthError) {
    console.log('error', error);
    this.error.set(error.message);
    this.showToastDanger();
  }

  onSubmit() {
    console.log(this.bookForm.getRawValue());
    if (this.bookForm.invalid || !this.selectedFile) {
      this.bookCoverError.set(
        'Please fill out all fields and upload a valid file.',
      );
      alert('Please fill out all fields and upload a valid file.');
      return;
    } else {
      this.bookCoverError.set('');
    }

    // Create book data as JSON string
    const bookData = JSON.stringify(this.bookForm.value);

    console.log('BookDaaata', bookData);

    // Create FormData object
    const formData = new FormData();
    formData.append('book', bookData);
    formData.append('coverImage', this.selectedFile!);

    // Make POST request
    // const headers = new HttpHeaders().set('Accept', 'application/json');

    // if (this.bookForm.valid && this.bookRecieved) {
    //   this.http
    //     .put<AuthorDetailsResponse>(
    //       `${URL}/books/bycover/${this.bookId()}`,
    //       formData,
    //     )
    //     .subscribe({
    //       next: (response: AuthorDetailsResponse) => {
    //         this.nextResponse(response);
    //       },
    //       error: (error: AuthError) => {
    //         this.errorResponse(error);
    //       },
    //     });
    // }
    console.log({
      'form data': formData.getAll('book'),
      image: formData.getAll('coverImage'),
    });

    // if (this.bookForm.valid && !this.bookRecieved) {
    //   this.http
    //     .post<AuthorDetailsResponse>(`${URL}/books/bycover`, formData)
    //     .subscribe({
    //       next: (response: AuthorDetailsResponse) => {
    //         this.nextResponse(response);
    //       },
    //       error: (error: AuthError) => {
    //         this.errorResponse(error);
    //       },
    //     });
    // }
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
