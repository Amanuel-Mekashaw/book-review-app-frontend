import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './ProfileDashboard.component.html',
  styleUrl: './ProfileDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardComponent { }
