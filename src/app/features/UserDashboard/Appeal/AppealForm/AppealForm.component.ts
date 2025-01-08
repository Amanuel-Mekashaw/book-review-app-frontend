import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../../Auth/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { URL } from '../../../shared/constants';
import { ApiError, GenericResponse } from '../../../../book.interface';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-appeal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HlmInputDirective,
    HlmButtonDirective,
    LoadingSpinnerComponent,
  ],
  templateUrl: './AppealForm.component.html',
  styleUrl: './AppealForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppealFormComponent implements OnInit, OnChanges {
  http = inject(HttpClient);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  appealForm: FormGroup;
  message = signal('');
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.appealForm = this.fb.group({
      id: new FormControl(0, [Validators.required]),
      email: new FormControl(
        {
          value:
            this.authService.currentUserSignal()?.data?.user?.username || '',
          disabled: true,
        },
        [Validators.required, Validators.email],
      ),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
      ]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  onSubmit() {
    this.loading.set(true);
    if (this.appealForm.valid) {
      this.http
        .post<GenericResponse>(
          `${URL}/appeal/create`,
          this.appealForm.getRawValue(),
        )
        .subscribe({
          next: (response: GenericResponse) => {
            this.message.set(response.message);
          },
          error: (error: ApiError) => {
            this.error.set(error.message);
          },
          complete: () => this.loading.set(false),
        });
    }
  }
}
