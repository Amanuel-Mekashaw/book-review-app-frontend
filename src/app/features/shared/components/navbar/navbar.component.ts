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
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
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
