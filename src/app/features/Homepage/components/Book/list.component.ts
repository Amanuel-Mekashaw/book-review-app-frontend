import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  signal,
} from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiError, Book } from '../../../../book.interface';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';
import { GenreApiResponse } from '../../../Genre/genre.interface';
import { UsersApiResponse } from '../../../Auth/user.interface';
import { URL } from '../../../shared/constants';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, HlmButtonDirective],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  @Input() remove: boolean;
  @Input() collectionId: number;
  book = input<Book>();

  http = inject(HttpClient);

  removeBookFromCollection(bookId: number) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');

    if (confirmDelete) {
      this.http
        .delete<UsersApiResponse>(
          `${URL}/collections/delete/${this.collectionId}/books/${bookId}`,
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
  }
}
