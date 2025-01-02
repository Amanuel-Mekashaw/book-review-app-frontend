import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
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
import { AuthService } from '../../Auth/auth.service';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

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

    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
  ],
  templateUrl: './CollectionsDashboard.component.html',
  styleUrl: './CollectionsDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsDashboardComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);

  isCreateFormOpen = signal(false);
  publicCollections = signal<Collection[] | null>(null);
  publicLoading = signal(false);
  publicError = signal('');

  privateCollections = signal<Collection[] | null>(null);
  privateLoading = signal(false);
  privateError = signal('');

  userId = signal(this.authService.currentUserSignal().data.user.id);
  tabOrientation = signal<'horizontal' | 'vertical'>('horizontal');

  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.tabOrientation.set('vertical');
    } else {
      this.tabOrientation.set('horizontal');
    }
  }

  ngOnInit(): void {
    this.fetchPublicCollections();
    this.fetchPrivateCollections();
  }

  fetchPublicCollections() {
    this.http
      .get<CollectionApiResponse>(`${URL}/collections/public`)
      .subscribe({
        next: (response: CollectionApiResponse) => {
          this.publicLoading.set(true);
          console.log('collections', response.data);
          this.publicCollections.set(response.data);
          this.publicLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('collections error', error);
          this.publicError.set(error.message);
        },
      });
  }

  fetchPrivateCollections() {
    this.http
      .get<CollectionApiResponse>(`${URL}/collections/private/${this.userId()}`)
      .subscribe({
        next: (response: CollectionApiResponse) => {
          this.privateLoading.set(true);
          console.log('collections', response.data);
          this.privateCollections.set(response.data);
          this.privateLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('collections error', error);
          this.privateError.set(error.message);
        },
      });
  }

  openCreateForm() {
    this.isCreateFormOpen.update((current) => !current);
  }
}
