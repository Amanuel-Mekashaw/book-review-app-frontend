import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';

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
  ],
  templateUrl: `./register.component.html`,
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup({
      username: new FormControl<string>('', [
        Validators.min(3),
        Validators.max(15),
        Validators.required,
      ]),
      email: new FormControl<string>('dcdcdcdc', [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl<string>('', [
        Validators.minLength(8),
        Validators.required,
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Form submitted', this.registerForm.value);
    } else {
      console.log('Form is invalid!', this.registerForm.errors);
    }
  }
}
