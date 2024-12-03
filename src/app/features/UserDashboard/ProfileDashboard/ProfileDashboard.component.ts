import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Auth/auth.service';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

import { ProfileFormComponent } from './ProfileForm/ProfileForm.component';
import { Router } from '@angular/router';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';

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
    HeroHeaderComponent,
  ],
  templateUrl: './ProfileDashboard.component.html',
  styleUrl: './ProfileDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    if (this.authService.currentUserDetail !== null) {
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
      );
      console.log(this.authService.currentUserDetail());
    }
  }

  editForm() {
    this.router.navigate(['dashboard', 'profile', 'edit']);
  }
}
