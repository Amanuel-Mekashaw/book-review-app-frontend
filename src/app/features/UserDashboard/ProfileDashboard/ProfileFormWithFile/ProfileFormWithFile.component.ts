import { CommonModule, NgOptimizedImage } from '@angular/common';
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
  selector: 'app-profile-form-with-file',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HlmToasterComponent,
    HlmInputDirective,
    HlmButtonModule,
  ],
  templateUrl: './ProfileFormWithFile.component.html',
  styleUrl: './ProfileFormWithFile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormWithFileComponent implements OnInit, OnChanges {
  @Input() user!: AuthorDetailsResponse;
  @Input() userId: number;
  @Input() admin: boolean;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  http = inject(HttpClient);

  profileForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl = signal<string | ArrayBuffer | null>(null);

  message = signal('');
  error = signal('');
  profileImageError = signal('');
  isSubmitting = signal(false);

  ngOnInit(): void {
    console.log('user passed', this.user);

    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageUrl.set(e.target.result); // Set the image source to the reader's result
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
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

    if (this.profileForm.invalid || !this.selectedFile) {
      this.profileImageError.set(
        'Please fill out all fields and upload a valid file.',
      );
      alert('Please fill out all fields and upload a valid file.');
      return;
    } else {
      this.profileImageError.set('');
    }

    // Create profile data as JSON string
    const profileData = JSON.stringify(this.profileForm.value);
    console.log('Profile Data', profileData);

    // Create FormData object
    const formData = new FormData();
    formData.append('userDetail', profileData);
    formData.append('profilePhoto', this.selectedFile!);

    console.log({
      profileData: this.profileForm.getRawValue(),
      profilePhoto: this.selectedFile!,
    });

    if (this.profileForm.valid && this.user) {
      console.log(this.profileForm.getRawValue());

      this.http
        .put<AuthorDetailsResponse>(
          `${URL}/userdetail/byprofile/${this.user?.data?.id}`,
          formData,
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
        .post<AuthorDetailsResponse>(`${URL}/userdetail/byprofile`, formData)
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
