import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  LeftSidebarComponent,
  Links,
} from '../left-sidebar/left-sidebar.component';
import { AuthService } from '../../../Auth/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LeftSidebarComponent],
  templateUrl: './AdminDashboardLayout.component.html',
  styleUrl: './AdminDashboardLayout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  links: Links[] = [
    {
      routeLink: 'dashboard',
      icon: 'fa-solid fa-grip',
      label: 'Dashboard',
    },
    {
      routeLink: 'users',
      icon: 'fal fa-solid fa-masks-theater',
      label: 'Users',
    },
    {
      routeLink: 'books',
      icon: 'fal fa-solid fa-book',
      label: 'Books',
    },
    {
      routeLink: 'profile',
      icon: 'fal fa-regular fa-user ',
      label: 'Profile',
    },
    {
      routeLink: 'genre',
      icon: 'fal fa-solid fa-masks-theater',
      label: 'Genre',
    },
  ];

  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    if (this.authService.currentUserSignal() === null) {
      this.router.navigateByUrl('/login');
    }
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });
}
