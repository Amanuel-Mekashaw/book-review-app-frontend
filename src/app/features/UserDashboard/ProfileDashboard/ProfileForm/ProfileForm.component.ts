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
import { response } from 'express';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HlmToasterComponent,
    HlmInputDirective,
    HlmButtonModule,
  ],
  templateUrl: './ProfileForm.component.html',
  styleUrl: './ProfileForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  @Input() user!: AuthorDetailsResponse;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  profileForm: FormGroup;
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    console.log('userId', this.user?.data?.id);

    this.profileForm = this.formBuilder.group({
      id: new FormControl(this.user?.data?.id | 1, Validators.required),
      firstName: new FormControl(
        this.user?.data?.firstName || '',
        Validators.required,
      ),
      lastName: new FormControl(
        this.user?.data?.lastName || '',
        Validators.required,
      ),
      biography: new FormControl(this.user?.data?.biography || ''),
      profilePicture: new FormControl(this.user?.data?.profilePicture),
      userId: [
        this.authService.currentUserSignal().data.user.id,
        Validators.required,
      ],
      socialLinks: this.formBuilder.array(this.user?.data?.socialLinks || []),
    });
  }

  // Get the FormArray for socialLinks
  get socialLinks(): FormArray {
    return this.profileForm.get('socialLinks') as FormArray;
  }

  // Add a new social link to the FormArray
  addSocialLink(link: string = ''): void {
    this.socialLinks.push(
      this.formBuilder.control(link, [
        Validators.required,
        Validators.pattern(
          /^(http[s]?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,
        ),
      ]),
    );
  }

  // Remove a social link from the FormArray
  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }

  nextResponse(response: AuthorDetailsResponse) {
    console.log('response', response);
    this.message.set(response.message);
    this.authService.currentUserDetail.set(response);
    localStorage.setItem(
      'userDetail',
      btoa(JSON.stringify(this.authService.currentUserDetail())),
    );
    this.showToastSuccess();
  }

  errorResponse(error: AuthError) {
    console.log('error', error);
    this.error.set(error.message);
    this.showToastDanger();
  }

  onSubmit() {
    if (this.profileForm.valid && this.user) {
      console.log(this.profileForm.getRawValue());

      this.http
        .put<AuthorDetailsResponse>(
          `${URL}/userdetail/${this.user?.data?.id}`,
          this.profileForm.getRawValue(),
        )
        .subscribe({
          next: (response: AuthorDetailsResponse) => {
            this.nextResponse(response);
          },
          error: (error: AuthError) => {
            this.errorResponse(error);
          },
        });
    }

    if (this.profileForm.valid && !this.user) {
      this.http
        .post<AuthorDetailsResponse>(
          `${URL}/userdetail`,
          this.profileForm.getRawValue(),
        )
        .subscribe({
          next: (response: AuthorDetailsResponse) => {
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
