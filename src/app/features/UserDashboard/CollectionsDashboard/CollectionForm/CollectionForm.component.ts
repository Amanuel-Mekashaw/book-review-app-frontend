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
  ],
  templateUrl: './CollectionForm.component.html',
  styleUrl: './CollectionForm.component.css',
})
export class CollectionFormComponent implements OnInit, OnChanges {
  @Input() collectionRecived: Collection;
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
    this.collectionForm = this.formBuilder.group({
      id: new FormControl(this.collectionRecived?.id || 0, Validators.required),
      name: new FormControl(
        this.collectionRecived?.name || '',
        Validators.required,
      ),
      description: new FormControl(
        this.collectionRecived?.description || '',
        Validators.required,
      ),
      userId: [
        this.authService.currentUserSignal().data.user.id,
        Validators.required,
      ],
    });
    console.log('Recieved', this.collectionRecived);
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Recieved changed', this.collectionRecived);
    this.initializeForm();
  }

  initializeForm() {
    this.collectionForm = this.formBuilder.group({
      id: new FormControl(this.collectionRecived?.id || 0, Validators.required),
      name: new FormControl(
        this.collectionRecived?.name || '',
        Validators.required,
      ),
      description: new FormControl(
        this.collectionRecived?.description || '',
        Validators.required,
      ),
      userId: [
        this.authService.currentUserSignal().data.user.id,
        Validators.required,
      ],
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

    if (this.collectionForm.valid && this.collectionRecived) {
      console.log(this.collectionForm.getRawValue());

      this.http
        .put<CollectionCreateApiResponse>(
          `${URL}/collections/${this.collectionRecived?.id}`,
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

    if (this.collectionForm.valid && !this.collectionRecived) {
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
