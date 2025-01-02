import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { toast } from 'ngx-sonner';
import { AuthError } from '../../../Auth/user.interface';
import {
  Collection,
  CollectionCreateApiResponse,
} from '../../../Collection/collection.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { URL } from '../../../shared/constants';
import { HlmCheckboxComponent } from '../../../../../lib/ui-checkbox-helm/src/lib/hlm-checkbox.component';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HlmToasterComponent,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmCheckboxComponent,
  ],
  templateUrl: './CollectionForm.component.html',
  styleUrl: './CollectionForm.component.css',
})
export class CollectionFormComponent implements OnInit, OnChanges {
  @Input() collectionRecieved: Collection;
  @Input() edit!: boolean;
  collectionId = input<number | null>();

  http = inject(HttpClient);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

  collectionForm: FormGroup;
  message = signal('');
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    console.log('Recieved', this.collectionRecieved);
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Recieved changed', this.collectionRecieved);
    this.initializeForm();
  }

  initializeForm() {
    this.collectionForm = this.formBuilder.group({
      id: new FormControl(
        this.collectionRecieved?.id || 0,
        Validators.required,
      ),
      name: new FormControl(
        this.collectionRecieved?.name || '',
        Validators.required,
      ),
      description: new FormControl(
        this.collectionRecieved?.description || '',
        Validators.required,
      ),
      userId: [
        this.authService.currentUserSignal().data.user.id,
        Validators.required,
      ],
      isPrivate: new FormControl(
        this.collectionRecieved?.private || false,
        Validators.required,
      ),
    });
  }

  nextResponse(response: CollectionCreateApiResponse) {
    this.loading.set(true);
    console.log('response', response);
    this.message.set(response.message);
    this.loading.set(false);
    this.showToastSuccess();
  }

  errorResponse(error: AuthError) {
    console.log('error', error);
    this.error.set(error.message);
    this.showToastDanger();
  }

  onSubmit() {
    console.log({
      Value: this.collectionForm.getRawValue(),
      valid: this.collectionForm.valid,
    });

    if (this.collectionForm.valid && this.collectionRecieved) {
      console.log(this.collectionForm.getRawValue());

      this.http
        .put<CollectionCreateApiResponse>(
          `${URL}/collections/${this.collectionRecieved?.id}`,
          this.collectionForm.getRawValue(),
        )
        .subscribe({
          next: (response: CollectionCreateApiResponse) => {
            this.nextResponse(response);
          },
          error: (error: AuthError) => {
            this.errorResponse(error);
          },
        });
    }

    if (this.collectionForm.valid && !this.collectionRecieved) {
      this.http
        .post<CollectionCreateApiResponse>(
          `${URL}/collections`,
          this.collectionForm.getRawValue(),
        )
        .subscribe({
          next: (response: CollectionCreateApiResponse) => {
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
