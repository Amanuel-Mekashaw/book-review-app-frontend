import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiError, BookByAuthor } from '../../../../book.interface';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../../shared/constants';

@Component({
  selector: 'app-book-author',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, HlmButtonDirective],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  book = input.required<BookByAuthor>();

  router = inject(Router);
  http = inject(HttpClient);

  editBook(id: number) {
    console.log(`dashboard/books/edit/${id}`);

    this.router.navigateByUrl(`dashboard/books/edit/${id}`);
  }

  deleteBook(id: number) {
    console.log('deleted book ', id);
    this.http.delete(`${URL}/books/${id}`).subscribe({
      next: (response) => {
        console.log(response);
        location.reload();
      },
      error: (error: ApiError) => {
        console.log(error);
      },
    });
  }
}
