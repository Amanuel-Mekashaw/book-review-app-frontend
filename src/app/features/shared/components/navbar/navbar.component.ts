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
import { HlmSheetComponent } from '../../../../../lib/ui-sheet-helm/src/lib/hlm-sheet.component';
import {
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '../../../../../lib/ui-sheet-helm/src/index';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnSheetTriggerDirective } from '@spartan-ng/ui-sheet-brain';
import { NavmobileComponent } from '../Navmobile/Navmobile.component';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    CommonModule,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
    HlmButtonDirective,
    BrnSheetTriggerDirective,
    NavmobileComponent,
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
    this.authService.currentUserSignal.set(
      JSON.parse(atob(localStorage.getItem('user'))),
    );
  }

  navbarOpen() {
    this.isOpen.set(!this.isOpen());
  }

  logout() {
    this.router.navigateByUrl('/login');
    this.authService.currentUserSignal.set(null);
    localStorage.removeItem('token');
  }
}
