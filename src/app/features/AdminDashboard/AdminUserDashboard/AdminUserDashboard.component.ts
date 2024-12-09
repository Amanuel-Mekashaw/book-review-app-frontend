import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-user-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './AdminUserDashboard.component.html',
  styleUrl: './AdminUserDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDashboardComponent { }
