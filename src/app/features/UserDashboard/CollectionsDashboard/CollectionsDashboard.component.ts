import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-collections-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './CollectionsDashboard.component.html',
  styleUrl: './CollectionsDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsDashboardComponent { }
