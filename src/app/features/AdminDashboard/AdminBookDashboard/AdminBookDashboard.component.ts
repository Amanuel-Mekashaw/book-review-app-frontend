import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BooksTable } from './BookTable/BookTable.component';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';

@Component({
  selector: 'app-admin-book-dashboard',
  standalone: true,
  imports: [BooksTable, HeroHeaderComponent],
  templateUrl: './AdminBookDashboard.component.html',
  styleUrl: './AdminBookDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBookDashboardComponent {}
