import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Collection, CollectionApiResponse } from './collection.interface';
import { URL } from '../shared/constants';
import { ApiError } from '../../book.interface';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';
import { RouterLink } from '@angular/router';
import { CollectionListComponent } from './CollectionList/CollectionList.component';
import { NoBooksFoundComponent } from '../shared/components/NoElementFound/NoElementFound.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    LoadingStateComponent,
    ErrorStateComponent,
    RouterLink,
    CollectionListComponent,
    NoBooksFoundComponent,
  ],
  templateUrl: './Collection.component.html',
  styleUrl: './Collection.component.css',
})
export class CollectionComponent implements OnInit {
  http = inject(HttpClient);

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
}
