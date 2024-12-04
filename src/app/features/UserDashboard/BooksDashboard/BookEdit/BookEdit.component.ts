import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BooksFormComponent } from '../BooksForm/BooksForm.component';
import { HeroHeaderComponent } from '../../../shared/components/HeroHeader/HeroHeader.component';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [BooksFormComponent, HeroHeaderComponent],
  templateUrl: './BookEdit.component.html',
  styleUrl: './BookEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {}
