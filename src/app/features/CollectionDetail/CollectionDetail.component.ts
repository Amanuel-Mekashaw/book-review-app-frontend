import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Collection } from '../Collection/collection.interface';
import { URL } from '../shared/constants';
import { ApiError } from '../../book.interface';
import { LoadingStateComponent } from '../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../shared/components/ErrorState/ErrorState.component';
import { CommonModule } from '@angular/common';
import { BooksListsComponent } from '../Homepage/components/BooksList/lists.component';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [
    LoadingStateComponent,
    ErrorStateComponent,
    CommonModule,
    BooksListsComponent,
  ],
  templateUrl: './CollectionDetail.component.html',
  styleUrl: './CollectionDetail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionDetailComponent implements OnInit {
  collectionId = input.required<number>();

  authService = inject(AuthService);
  http = inject(HttpClient);

  collection = signal<any | null>(null);
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    if (this.authService.currentUserDetail() === null) {
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
      );
    }

    this.fetchCollectionDetail(this.collectionId());
  }

  fetchCollectionDetail(id: number) {
    this.http.get(`${URL}/collections/${id}`).subscribe({
      next: (response) => {
        this.loading.set(true);
        console.log('Collection huh', response);
        this.collection.set(response);
        this.loading.set(false);
      },
      error: (error: ApiError) => {
        console.log(error);
        this.error.set(error.message);
      },
    });
  }
}
