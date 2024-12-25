import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Auth/auth.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';

import { NavmobileComponent } from '../Navmobile/Navmobile.component';

import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import { AuthorDetailsResponse } from '../../../Auth/user.interface';
import { ApiError } from '../../../../book.interface';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    CommonModule,
    NavmobileComponent,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmAvatarImageDirective,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    BrnMenuTriggerDirective,
    NgOptimizedImage,
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);

  author = signal(null);
  authorLoading = signal(false);
  authorError = signal('');

  isOpen = signal(false);

  constructor() {}

  ngOnInit(): void {
    console.log(
      'is there a user',
      this.authService.currentUserSignal() !== null,
    );
    if (this.authService.currentUserSignal() !== null) {
      this.fetchAuthorDetail(
        this.authService.currentUserSignal().data?.user?.id,
      );
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
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
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
  }

  navbarOpen() {
    this.isOpen.set(!this.isOpen());
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userDetail');
    this.authService.currentUserSignal.set(null);
    this.authService.currentUserDetail.set(null);
    this.router.navigateByUrl('/login');
  }
}
