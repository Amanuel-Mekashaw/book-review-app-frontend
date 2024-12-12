import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Collection } from '../collection.interface';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../shared/constants';
import { ApiError } from '../../../book.interface';
import { toast } from 'ngx-sonner';
import { HlmToasterComponent } from '../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [RouterLink, DatePipe, HlmToasterComponent],
  templateUrl: './CollectionCard.component.html',
  styleUrl: './CollectionCard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardComponent {
  @Input() collection!: Collection;
  @Input() index!: number;
  @Input() delete: boolean;
  @Input() edit: boolean;

  http = inject(HttpClient);
  router = inject(Router);
  message = signal('');
  error = signal('');

  deleteCollection(id: number) {
    this.http.delete(`${URL}/collections/${id}`).subscribe({
      next: (response) => {
        console.log('Deleted', response);
        this.showToastSuccess();
        location.reload();
      },
      error: (error: ApiError) => {
        console.log('Error', error);
        this.showToastDanger();
      },
    });
  }
  editCollection(id: number) {
    this.router.navigateByUrl(`/dashboard/collections/edit/${id}`);
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
