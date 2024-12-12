import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { HeroHeaderComponent } from '../../../shared/components/HeroHeader/HeroHeader.component';
import { CollectionFormComponent } from '../CollectionForm/CollectionForm.component';
import { HttpClient } from '@angular/common/http';
import { Collection } from '../../../Collection/collection.interface';
import { URL } from '../../../shared/constants';
import { ApiError } from '../../../../book.interface';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-edit',
  standalone: true,
  imports: [
    HeroHeaderComponent,
    CollectionFormComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    CommonModule,
  ],
  templateUrl: './CollectionEdit.component.html',
  styleUrl: './CollectionEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionEditComponent implements OnInit {
  collectionId = input.required<number>();

  http = inject(HttpClient);

  collection = signal<Collection | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    console.log('collection id', this.collectionId());

    this.fetchCollection(this.collectionId());
  }

  fetchCollection(id: number) {
    this.http.get<Collection>(`${URL}/collections/${id}`).subscribe({
      next: (response: Collection) => {
        this.loading.set(true);
        console.log('Collection Response', response);
        this.collection.set(response);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('error', error);
        this.error.set(error.message);
      },
    });
  }
}
