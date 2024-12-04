import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { BooksFormComponent } from './BooksForm/BooksForm.component';

@Component({
  selector: 'app-books-dashboard',
  standalone: true,
  imports: [HeroHeaderComponent, BooksFormComponent],
  templateUrl: './BooksDashboard.component.html',
  styleUrl: './BooksDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksDashboardComponent {}
