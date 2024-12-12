import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { ApiError } from '../../../book.interface';
import { URL } from '../../shared/constants';
import { User, UsersApiResponse } from '../../Auth/user.interface';
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
