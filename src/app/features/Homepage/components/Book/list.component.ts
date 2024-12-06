import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Book } from '../../../../book.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  book = input<Book>();
}
