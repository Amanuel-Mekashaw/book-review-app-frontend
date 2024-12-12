import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BookByAuthor } from '../../../../book.interface';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

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

  editBook(id: number) {
    console.log(`dashboard/books/edit/${id}`);

    this.router.navigateByUrl(`dashboard/books/edit/${id}`);
  }

  deleteBook(id: number) {}
}
