import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Auth/auth.service';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

import { ProfileFormComponent } from './ProfileForm/ProfileForm.component';
import { Router } from '@angular/router';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { AuthorDetailsResponse } from '../../Auth/user.interface';
import { HttpClient } from '@angular/common/http';
import { ApiError } from '../../../book.interface';
import { URL } from '../../shared/constants';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  biography?: string;
  profilePicture?: string;
  userId: number;
  socialLinks: string[];
}

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HlmButtonModule,
    ProfileFormComponent,
  ],
  templateUrl: './ProfileDashboard.component.html',
  styleUrl: './ProfileDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);

  author = signal(null);
  authorLoading = signal(false);
  authorError = signal('');

  ngOnInit(): void {
    if (this.authService.currentUserSignal() !== null) {
      console.log('Profile User signal', this.authService.currentUserSignal());
      this.fetchAuthorDetail(
        this.authService.currentUserSignal()?.data?.user?.id,
      );
    }
  }

  fetchAuthorDetail(id: number) {
    this.http
      .get<AuthorDetailsResponse>(`${URL}/userdetail/by-authordetail/${id}`)
      .subscribe({
        next: (response: AuthorDetailsResponse) => {
          this.authorLoading.set(true);
          console.log('authordetail', response);
          this.author.set(response);
          localStorage.setItem('userDetail', btoa(JSON.stringify(response)));
          this.authService.currentUserDetail.set(response);
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
  }

  editForm() {
    this.router.navigate(['dashboard', 'profile', 'edit']);
  }
}
