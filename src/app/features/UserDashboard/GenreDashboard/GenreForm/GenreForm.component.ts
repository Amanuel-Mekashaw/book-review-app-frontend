import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthError, AuthorDetailsResponse } from '../../../Auth/user.interface';
import { AuthService } from '../../../Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { URL } from '../../../shared/constants';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { GenrePostResponse } from '../../../Genre/genre.interface';

@Component({
  selector: 'app-genre-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HlmToasterComponent,
    HlmInputDirective,
    HlmButtonModule,
  ],
  templateUrl: './GenreForm.component.html',
  styleUrl: './GenreForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  @Input() genre!: GenrePostResponse;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  genreForm: FormGroup;
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    console.log('userId', this.genre?.data?.id);

    this.genreForm = this.formBuilder.group({
      id: new FormControl(this.genre?.data?.id || 0, Validators.required),
      name: new FormControl(this.genre?.data?.name || '', Validators.required),
      description: new FormControl(
        this.genre?.data?.description || '',
        Validators.required,
      ),
    });
  }

  nextResponse(response: GenrePostResponse) {
    console.log('response', response);
    this.message.set(response.message);
    this.showToastSuccess();
  }

  errorResponse(error: AuthError) {
    console.log('error', error);
    this.error.set(error.message);
    this.showToastDanger();
  }

  onSubmit() {
    console.log(this.genreForm.getRawValue());
    if (this.genreForm.valid && this.genre) {
      console.log(this.genreForm.getRawValue());

      this.http
        .put<GenrePostResponse>(
          `${URL}/genre/${this.genre?.data?.id}`,
          this.genreForm.getRawValue(),
        )
        .subscribe({
          next: (response: GenrePostResponse) => {
            this.nextResponse(response);
          },
          error: (error: AuthError) => {
            this.errorResponse(error);
          },
        });
    }

    if (this.genreForm.valid && !this.genre) {
      this.http
        .post<GenrePostResponse>(`${URL}/genre`, this.genreForm.getRawValue())
        .subscribe({
          next: (response: GenrePostResponse) => {
            this.nextResponse(response);
          },
          error: (error: AuthError) => {
            this.errorResponse(error);
          },
        });
    }
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
