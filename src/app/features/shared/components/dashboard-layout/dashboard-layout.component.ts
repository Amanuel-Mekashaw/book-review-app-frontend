import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  LeftSidebarComponent,
  Links,
} from '../left-sidebar/left-sidebar.component';
import { AuthService } from '../../../Auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, LeftSidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  links: Links[] = [
    {
      routeLink: 'books',
      icon: 'fal fa-solid fa-book',
      label: 'Books',
    },

    // {
    //   routeLink: 'genres',
    //   icon: 'fal fa-solid fa-masks-theater',
    //   label: 'Genres',
    // },
    {
      routeLink: 'collections',
      icon: 'fal fa-solid fa-rectangle-list',
      label: 'Collections',
    },
    {
      routeLink: 'profile',
      icon: 'fal fa-regular fa-user ',
      label: 'Profile',
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
