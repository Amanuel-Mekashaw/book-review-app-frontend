import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-genre-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './GenreDashboard.component.html',
  styleUrl: './GenreDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreDashboardComponent { }
