import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

import { URL } from '../../shared/constants';
import { AuthError, AuthResponse } from '../user.interface';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HlmInputDirective,
    HlmLabelDirective,
    HlmSeparatorDirective,
    RouterLink,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HlmToasterComponent,
  ],
  templateUrl: `./register.component.html`,
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm: FormGroup;
  message = signal('');
  error = signal('');

  passwordValidator(control: FormControl): ValidationErrors | null {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const valid = regex.test(control.value);

    return valid
      ? null
      : {
          passwordInvalid: {
            value: control.value,
            message:
              'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
          },
        };
  }

  constructor() {
    this.registerForm = new FormGroup({
      username: new FormControl<string>('', [
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.required,
      ]),
      email: new FormControl<string>('', [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl<string>('', [
        Validators.minLength(8),
        Validators.required,
        this.passwordValidator,
      ]),
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.http
      .post<AuthResponse>(
        `${URL}/auth/register`,
        this.registerForm.getRawValue(),
      )
      .subscribe({
        next: (response: AuthResponse) => {
          console.log('response', response);
          this.message.set(response.message);
          localStorage.setItem('token', response.data.token);
          this.authService.currentUserSignal.set(response);
          this.showToastSuccess();

          // this.router.navigateByUrl('/login');
        },
        error: (error: AuthError) => {
          console.log('error', error);
          this.error.set(error.message);
          this.showToastDanger();
        },
      });
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
