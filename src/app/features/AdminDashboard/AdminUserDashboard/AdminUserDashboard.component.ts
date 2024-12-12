import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UsersTable } from './UsersTable/UsersTable.component';

@Component({
  selector: 'app-admin-user-dashboard',
  standalone: true,
  imports: [UsersTable],
  templateUrl: './AdminUserDashboard.component.html',
  styleUrl: './AdminUserDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDashboardComponent {}
