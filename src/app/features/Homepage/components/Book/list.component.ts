import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Book } from '../../../../book.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  book = input<Book>();
}
