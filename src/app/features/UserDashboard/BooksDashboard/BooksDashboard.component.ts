import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-books-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './BooksDashboard.component.html',
  styleUrl: './BooksDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksDashboardComponent { }
