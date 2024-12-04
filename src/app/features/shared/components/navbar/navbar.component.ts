import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Auth/auth.service';
import { CommonModule } from '@angular/common';

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
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  isOpen = signal(false);

  constructor() {}

  ngOnInit(): void {
    if (this.authService.currentUserDetail() !== null) {
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
      );
    }

    // TODO: encrypt this information
    this.authService.currentUserSignal.set(
      JSON.parse(localStorage.getItem('user')),
    );
  }

  navbarOpen() {
    this.isOpen.set(!this.isOpen());
  }

  logout() {
    this.authService.currentUserSignal.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userDetail');
    this.router.navigateByUrl('/login');
  }
}
