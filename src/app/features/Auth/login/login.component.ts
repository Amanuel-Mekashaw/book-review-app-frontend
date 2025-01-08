import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';

import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthError, AuthResponse } from '../user.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { URL } from '../../shared/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HlmInputDirective,
    HlmLabelDirective,
    HlmCheckboxComponent,
    HlmSeparatorDirective,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HlmToasterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup;
  message = signal('');
  error = signal('');

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl<string>('', [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl<string>('', [
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this.authService.initializeUser();
    this.authService.navigateBasedOnUserDetail();
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.http
      .post<AuthResponse>(
        `${URL}/auth/authenticate`,
        this.loginForm.getRawValue(),
      )
      .subscribe({
        next: (response: AuthResponse) => {
          console.log('Login response', response);
          this.message.set(response.message);
          this.authService.currentUserSignal.set(response);

          this.storeOnStorage(response, this.authService.currentUserSignal());

          this.showToastSuccess();
          this.router.navigateByUrl('/books');
        },
        error: (error: AuthError) => {
          console.log('error', error);
          this.error.set(error.message);
          this.showToastDanger();
        },
      });
  }

  storeOnStorage(response: AuthResponse, userSignal: AuthResponse) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', btoa(JSON.stringify(userSignal)));
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', btoa(JSON.stringify(userSignal)));
  }

  showToastSuccess() {
    toast.success('Success', {
      description: this.message(),
    });
  }

  showToastDanger() {
    toast.error('Unsuccessfull', {
      description: this.error(),
    });
  }
}
