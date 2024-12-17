import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
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
export class ProfileFormComponent implements OnInit, OnChanges {
  @Input() user!: AuthorDetailsResponse;
  @Input() userId: number;
  @Input() admin: boolean;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  profileForm: FormGroup;
  message = signal('');
  error = signal('');
  isSubmitting = signal(false);

  ngOnInit(): void {
    console.log('user passed', this.user);

    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    console.log('Info', {
      userid: this.userId || null,
      userwithid: this.user?.data?.id || null,
      user: this.user?.data,
    });
    this.profileForm = this.formBuilder.group({
      id: new FormControl(
        this.admin ? this.userId : this.user?.data?.id | 0,
        Validators.required,
      ),
      firstName: new FormControl(
        this.user?.data?.firstName || '',
        Validators.required,
      ),
      lastName: new FormControl(
        this.user?.data?.lastName || '',
        Validators.required,
      ),
      biography: new FormControl(
        this.user?.data?.biography || '',
        Validators.maxLength(255),
      ),
      profilePicture: new FormControl(this.user?.data?.profilePicture),
      userId: [
        this.admin
          ? this.userId
          : this.authService.currentUserSignal().data.user.id ||
            this.user?.data?.id,
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
    this.isSubmitting.set(true);
    console.log('response', response);
    this.message.set(response.message);
    this.authService.currentUserDetail.set(response);
    localStorage.setItem(
      'userDetail',
      btoa(JSON.stringify(this.authService.currentUserDetail())),
    );
    this.isSubmitting.set(false);
    this.showToastSuccess();
  }

  errorResponse(error: AuthError) {
    console.log('error', error);
    this.error.set(error.message);
    this.showToastDanger();
  }

  onSubmit() {
    console.log(this.profileForm.getRawValue());

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
            this.authService.currentUserDetail.set(response);
            localStorage.setItem('userDetail', btoa(JSON.stringify(response)));
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
