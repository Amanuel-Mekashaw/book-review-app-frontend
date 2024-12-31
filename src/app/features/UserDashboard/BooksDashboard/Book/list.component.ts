import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ApiError,
  BookByAuthor,
  BookResponse,
  BookResponseByAuthor,
} from '../../../../book.interface';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../../shared/constants';
import { BooksService } from '../../../../services/books.service';
import { AuthService } from '../../../Auth/auth.service';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';

@Component({
  selector: 'app-book-author',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmButtonDirective, HlmToasterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  book = input.required<BookByAuthor>();

  bookService = inject(BooksService);
  authService = inject(AuthService);

  router = inject(Router);
  http = inject(HttpClient);

  editBook(id: number) {
    console.log(`dashboard/books/edit/${id}`);

    this.router.navigateByUrl(`dashboard/books/edit/${id}`);
  }

  deleteBook(id: number) {
    console.log('deleted book ', id);
    this.http.delete(`${URL}/books/${id}`).subscribe({
      next: (response: BookResponseByAuthor) => {
        console.log(response);
        this.bookService.showToastSuccess(response.message);
        this.bookService.fetchAllBooksByAuthor(
          this.authService.currentUserSignal()?.data?.user?.id,
        );
      },
      error: (error: ApiError) => {
        console.log(error);
        this.bookService.showToastDanger(error.message);
      },
    });
  }
}
