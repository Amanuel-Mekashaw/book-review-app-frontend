import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectionFormComponent } from './CollectionForm/CollectionForm.component';
import { HttpClient } from '@angular/common/http';
import {
  Collection,
  CollectionApiResponse,
} from '../../Collection/collection.interface';
import { URL } from '../../shared/constants';
import { ApiError } from '../../../book.interface';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { LoadingStateComponent } from '../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../shared/components/ErrorState/ErrorState.component';
import { CollectionListComponent } from '../../Collection/CollectionList/CollectionList.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-collections-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CollectionFormComponent,
    HeroHeaderComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    CollectionListComponent,
    HlmButtonDirective,
  ],
  templateUrl: './CollectionsDashboard.component.html',
  styleUrl: './CollectionsDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsDashboardComponent implements OnInit {
  http = inject(HttpClient);

  isCreateFormOpen = signal(false);
  collections = signal<Collection[] | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.fetchCollections();
  }

  fetchCollections() {
    this.http.get<CollectionApiResponse>(`${URL}/collections`).subscribe({
      next: (response: CollectionApiResponse) => {
        this.loading.set(true);
        console.log('collections', response.data.content);
        this.collections.set(response.data.content);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log('collections error', error);
        this.error.set(error.message);
      },
    });
  }

  openCreateForm() {
    this.isCreateFormOpen.update((current) => !current);
  }
}
