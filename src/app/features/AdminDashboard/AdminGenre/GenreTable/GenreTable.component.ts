import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TrackByFunction,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideCircleEllipsis,
} from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import {
  HlmCheckboxCheckIconComponent,
  HlmCheckboxComponent,
} from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import {
  BrnTableModule,
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { debounceTime, map } from 'rxjs';
import { User, UsersApiResponse } from '../../../Auth/user.interface';
import { ApiError } from '../../../../book.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL } from '../../../shared/constants';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { toast } from 'ngx-sonner';
import { Genre } from '../../../../genre.interface';
import { NoBooksFoundComponent } from '../../../shared/components/NoElementFound/NoElementFound.component';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';

@Component({
  selector: 'app-genre-dashboard-table',
  standalone: true,
  imports: [
    FormsModule,
    BrnMenuTriggerDirective,
    HlmMenuModule,
    BrnTableModule,
    HlmTableModule,
    HlmButtonModule,
    HlmIconComponent,
    HlmInputDirective,
    HlmCheckboxComponent,
    BrnSelectModule,
    HlmSelectModule,
    CommonModule,
    HlmToasterComponent,
    NoBooksFoundComponent,
    LoadingStateComponent,
    ErrorStateComponent,
  ],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideCircleEllipsis,
      lucideArrowUpDown,
    }),
  ],
  host: {
    class: 'w-full',
  },
  templateUrl: './GenreTable.component.html',
  styleUrls: ['./GenreTable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresTable implements OnInit, OnChanges {
  http = inject(HttpClient);
  router = inject(Router);

  genres = signal<Genre[] | null | undefined>(null);
  error = signal<string>('');
  loading = signal(false);
  message = signal('');

  protected readonly _rawFilterInput = signal('');
  protected readonly _genreFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300)),
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Genre>(true);
  protected readonly _isUserSelected = (genre: Genre) =>
    this._selectionModel.isSelected(genre);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map((change) => change.source.selected)),
    {
      initialValue: [],
    },
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    id: { visible: true, label: 'ID' },
    name: { visible: true, label: 'Genre Name' },
    description: { visible: true, label: 'Description' },
    createdAt: { visible: true, label: 'Created at' },
    updatedAt: { visible: true, label: 'Updated at' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private _genres = signal([]);
  private _filteredGenres = computed(() => {
    const nameFilter = this._genreFilter()?.trim()?.toLowerCase();
    if (nameFilter && nameFilter.length > 0) {
      return this._genres().filter((genre) =>
        genre.name.toLowerCase().includes(nameFilter),
      );
    }
    return this._genres();
  });

  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedUsers = computed(() => {
    const sort = this._nameSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const genres = this._filteredGenres();
    if (!sort) {
      return genres.slice(start, end);
    }
    return [...genres]
      .sort(
        (p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.name.localeCompare(p2.name),
      )
      .slice(start, end);
  });

  protected readonly _allFilteredPaginatedUsersSelected = computed(() =>
    this._filteredSortedPaginatedUsers().every((genres) =>
      this._selected().includes(genres),
    ),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedUsersSelected()
      ? true
      : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Genre> = (
    _: number,
    genre: Genre,
  ) => genre.id;
  protected readonly _totalElements = computed(
    () => this._filteredGenres().length,
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
    effect(() => this._genreFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected toggleGenre(genres: Genre) {
    this._selectionModel.toggle(genres);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedUsers());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedUsers());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._nameSort();
    if (sort === 'ASC') {
      this._nameSort.set('DESC');
    } else if (sort === 'DESC') {
      this._nameSort.set(null);
    } else {
      this._nameSort.set('ASC');
    }
  }

  fetchGenres() {
    this.http.get<Genre[]>(`${URL}/genre`).subscribe({
      next: (response: Genre[]) => {
        this.loading.set(true);
        this.genres.set(response);
        this._genres.set(response);
        this.loading.set(false);
        console.log('genres', this._genres());
      },
      error: (error: ApiError) => {
        // console.log('error', error);
        this.error.set(error.message);
      },
    });
  }

  ngOnInit(): void {
    this.fetchGenres();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  onGenreDelete(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');

    if (confirmDelete) {
      this.http.delete<UsersApiResponse>(`${URL}/genre/${id}`).subscribe({
        next: (response) => {
          this.message.set(response.message);
          this.showToastSuccess();
          location.reload();
          console.log('genres', this._genres());
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
          this.showToastDanger();
        },
      });
    }
  }

  onGenreEdit(id: number) {
    // alert(`edit Genre id ${id}`);
    this.router.navigateByUrl(`admin/genre/edit/${id}`);
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
