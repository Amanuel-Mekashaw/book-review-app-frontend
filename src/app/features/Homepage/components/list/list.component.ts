import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Book } from '../../../../book_interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  book = input<Book>();
}
