import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { URL } from '../shared/constants';
import { Book } from '../../book.interface';
import { ApiError } from '../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';
import { AuthorDetailsResponse } from '../Auth/user.interface';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { GenreAddModalComponent } from './GenreAddModal/GenreAddModal.component';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';
import {
  Collection,
  CollectionApiResponse,
} from '../Collection/collection.interface';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { NoBooksFoundComponent } from '../shared/components/NoElementFound/NoElementFound.component';
import { StarRatingComponent } from '../shared/components/StarRating/StarRating.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentComponent } from '../shared/components/Comment/Comment.component';
import { Rating, RatingApiResponse } from '../../rating.interface';
import { response } from 'express';
import { CommentFormComponent } from '../shared/components/CommentForm/CommentForm.component';
import { RatingDescriptionComponent } from '../shared/components/RatingDescription/RatingDescription.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmAvatarImageDirective,
    HlmButtonDirective,
    RouterLink,
    GenreAddModalComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    HlmToasterComponent,
    NoBooksFoundComponent,
    StarRatingComponent,
    CommentComponent,
    CommentFormComponent,
    RatingDescriptionComponent,
  ],
  templateUrl: './BookDetails.component.html',
  styleUrl: './BookDetails.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent implements OnInit {
  // activeRoute = inject(ActivatedRoute);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  dialog = inject(HlmDialogService);
  formBuilder = inject(FormBuilder);

  book = signal<Book | null | undefined>(null);
  author = signal<AuthorDetailsResponse>(null);
  collections = signal<Collection[] | null>(null);
  collectionSuccess = signal('');
  error = signal('');
  authorError = signal('');
  collectionError = signal('');
  collectionAddError = signal('');
  loading = signal(false);
  authorLoading = signal(false);
  collectionLoading = signal(false);
  isCollectionListOpen = signal(false);

  ratings = signal<Rating[] | null>(null);
  ratingLoading = signal(false);
  ratingError = signal('');

  ratingForm: FormGroup;
  isRatingChecked = signal(false);
  maxRating = signal(10);

  // bookId = signal(this.activeRoute.snapshot.params['id']);

  // automatically bookId will be fetched from the url since i have enabled withComponentInputBinding()
  // in angular route provider in app.config.ts
  bookId = input.required<number>();

  userId = this.authService.currentUserSignal()?.data?.user?.id;

  isReadMe = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    console.log('from book details', this.authService.currentUserSignal());
    console.log(
      'from book details user detail',
      this.authService.currentUserDetail(),
    );

    if (this.authService.currentUserDetail() === null) {
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
      );
    }
    console.log(
      'from book details user detail updated',
      this.authService.currentUserDetail(),
    );

    // fetch book detail
    this.http.get<Book>(`${URL}/books/${+this.bookId()}`).subscribe({
      next: (response: Book) => {
        this.loading.set(true);
        console.log('Books recieved', response);
        this.book.set(response);
        this.loading.set(false);
        this.fetchAuthorDetail();
        // this.fetchGenre();
      },
      error: (error: ApiError) => {
        // console.log('error', error);
        this.error.set(error.message);
      },
    });

    console.log('id', this.book()?.author?.id);
  }

  private initializeForm() {
    this.ratingForm = this.formBuilder.group({
      rating: [0], // Default rating
    });
  }

  fetchAuthorDetail() {
    this.http
      .get<AuthorDetailsResponse>(
        `${URL}/userdetail/by-authordetail/${this.book()?.author?.id}`,
      )
      .subscribe({
        next: (response: AuthorDetailsResponse) => {
          this.authorLoading.set(true);
          console.log('authordetail', response);
          this.author.set(response);
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
  }

  fetchCollections() {
    this.http.get<CollectionApiResponse>(`${URL}/collections`).subscribe({
      next: (response: CollectionApiResponse) => {
        this.collectionLoading.set(true);
        console.log('collections', response.data.content);
        this.collections.set(response.data.content);
        this.collectionLoading.set(false);
      },
      error: (error: ApiError) => {
        console.log('collections error', error);
        this.collectionError.set(error.message);
      },
    });
  }

  fetchRating() {
    this.http.get(`${URL}/bookrating/getratings/${this.bookId()}`).subscribe({
      next: (response: RatingApiResponse) => {
        this.ratingLoading.set(true);
        console.log(response);
        this.ratings.set(response.data);
        this.ratingLoading.set(false);
      },
      error: (error: ApiError) => {
        console.log(error);
        this.ratingError.set(error.message);
      },
    });
  }

  openReadMe() {
    this.isReadMe.update((current) => !current);
  }

  editBook(id: number) {
    this.router.navigateByUrl(`/dashboard/books/edit/${id}`);
  }

  onModalOpen() {
    this.dialog.open(GenreAddModalComponent, {
      closeOnBackdropClick: true,
    });
  }

  // displayCollections(bookId: number, collectionId: number) {
  //   this.fetchCollections();
  //   this.isCollectionListOpen.update((current) => !current);
  //   this.addToCollection(bookId, collectionId);
  // }

  addToCollection(bookId: number, collectionId: number) {
    console.log({ bookid: bookId, collectionid: collectionId });
    this.http
      .post(`${URL}/collections/${collectionId}/books/${bookId}`, {})
      .subscribe({
        next: (response: CollectionApiResponse) => {
          console.log(response);
          this.collectionSuccess.set(response.message);
          this.showToastSuccess();
        },
        error: (error: ApiError) => {
          console.log(error.message);
          this.collectionAddError.set(error.message);
          this.showToastDanger();
        },
      });
  }

  showToastSuccess() {
    toast.success('Success', {
      description: this.collectionSuccess(),
    });
  }

  showToastDanger() {
    toast.error('Unsuccessfull', {
      description: this.collectionAddError(),
    });
  }

  onRatingChange(ratingValue: number, bookId: number) {
    // this.isRatingChecked.set(rating > 0 ? true : false);
    // console.log('checked', this.isRatingChecked());

    this.http
      .post(
        `${URL}/bookrating/rate?userId=${this.userId}&bookId=${bookId}&ratingValue=${ratingValue}`,
        {},
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          location.reload();
        },
        error: (error: ApiError) => {
          console.log(error);
        },
      });
  }

  onSubmit() {
    console.log('Form submitted:', this.ratingForm.value);
  }
}
