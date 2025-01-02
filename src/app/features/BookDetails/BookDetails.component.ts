import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { URL } from '../shared/constants';
import { Book } from '../../book.interface';
import { ApiError } from '../../book.interface';
import { CommonModule } from '@angular/common';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentComponent } from '../shared/components/Comment/Comment.component';
import { Rating, RatingApiResponse } from '../../rating.interface';

import { CommentFormComponent } from '../shared/components/CommentForm/CommentForm.component';
import { RatingDescriptionComponent } from '../shared/components/RatingDescription/RatingDescription.component';
import { BooksService } from '../../services/books.service';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmAvatarImageDirective,
    HlmButtonDirective,
    HlmBadgeDirective,
    RouterLink,
    LoadingStateComponent,
    ErrorStateComponent,
    HlmToasterComponent,
    NoBooksFoundComponent,
    CommentComponent,
    CommentFormComponent,
    RatingDescriptionComponent,
  ],
  templateUrl: './BookDetails.component.html',
  styleUrl: './BookDetails.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent implements OnInit {
  authService = inject(AuthService);
  bookService = inject(BooksService);
  router = inject(Router);
  dialog = inject(HlmDialogService);

  isRatingChecked = signal(false);
  maxRating = signal(10);

  // automatically bookId will be fetched from the url since i have enabled withComponentInputBinding()
  // in angular route provider in app.config.ts
  bookId = input.required<number>();

  userId = this.authService.currentUserSignal()?.data?.user?.id;

  isReadMe = signal(false);

  ngOnInit(): void {
    this.authService.initializeUser();
    this.bookService.fetchBookDetails(this.bookId());
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
}
