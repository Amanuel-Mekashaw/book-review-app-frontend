import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UsersTable } from './UsersTable/UsersTable.component';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-user-dashboard',
  standalone: true,
  imports: [UsersTable, HeroHeaderComponent, HlmButtonDirective, RouterLink],
  templateUrl: './AdminUserDashboard.component.html',
  styleUrl: './AdminUserDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDashboardComponent {}
