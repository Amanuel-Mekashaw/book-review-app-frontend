import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
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
import { ApiError, Book, BookResponse } from '../../../../book.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL } from '../../../shared/constants';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { toast } from 'ngx-sonner';
import { UsersApiResponse } from '../../../Auth/user.interface';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';
import { NoBooksFoundComponent } from '../../../shared/components/NoElementFound/NoElementFound.component';

@Component({
  selector: 'app-book-dashboard-table',
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
    LoadingStateComponent,
    ErrorStateComponent,
    NoBooksFoundComponent,
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
  templateUrl: './BookTable.component.html',
  styleUrls: ['./BookTable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksTable implements OnInit, OnChanges {
  http = inject(HttpClient);
  router = inject(Router);

  books = signal<Book[] | null>(null);
  error = signal<string>('');
  loading = signal(false);
  message = signal('');

  protected readonly _rawFilterInput = signal('');
  protected readonly _bookFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300)),
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Book>(true);
  protected readonly _isUserSelected = (book: Book) =>
    this._selectionModel.isSelected(book);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map((change) => change.source.selected)),
    {
      initialValue: [],
    },
  );

  // must do don't forget
  protected readonly _brnColumnManager = useBrnColumnManager({
    id: { visible: true, label: 'ID' },
    title: { visible: true, label: 'Book Name' },
    isbn: { visible: true, label: 'Book ISBN' },
    description: { visible: true, label: 'Description' },
    publishedYear: { visible: true, label: 'Published year' },
    pages: { visible: true, label: 'Pages' },
    // coverImageUrl: { visible: true, label: 'Cover page' },
  });

  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  _books = signal<Book[] | [] | null>([]);
  private _filteredBooks = computed(() => {
    const nameFilter = this._bookFilter()?.trim()?.toLowerCase();
    if (nameFilter && nameFilter.length > 0) {
      return this._books().filter((book: Book) =>
        book.title.toLowerCase().includes(nameFilter),
      );
    }
    return this._books();
  });

  private readonly _nameSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedUsers = computed(() => {
    const sort = this._nameSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const books = this._filteredBooks();
    if (!sort) {
      return books.slice(start, end);
    }
    return [...books]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) * p1.title.localeCompare(p2.title),
      )
      .slice(start, end);
  });

  protected readonly _allFilteredPaginatedBooksSelected = computed(() =>
    this._filteredSortedPaginatedUsers().every((genres) =>
      this._selected().includes(genres),
    ),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedBooksSelected()
      ? true
      : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Book> = (
    _: number,
    book: Book,
  ) => book.id;
  protected readonly _totalElements = computed(
    () => this._filteredBooks().length,
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
    effect(() => this._bookFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected toggleGenre(books: Book) {
    this._selectionModel.toggle(books);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedUsers());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedUsers());
    }
  }

  protected handleBookSortChange() {
    const sort = this._nameSort();
    if (sort === 'ASC') {
      this._nameSort.set('DESC');
    } else if (sort === 'DESC') {
      this._nameSort.set(null);
    } else {
      this._nameSort.set('ASC');
    }
  }

  fetchBooks() {
    this.http.get<BookResponse>(`${URL}/books`).subscribe({
      next: (response: BookResponse) => {
        this.loading.set(true);
        this.books.set(response.content);
        this._books.set(response.content);
        this.loading.set(false);
        console.log('books', this._books());
      },
      error: (error: ApiError) => {
        this.error.set(error.message);
      },
    });
  }

  ngOnInit(): void {
    this.fetchBooks();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  onBookDelete(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');

    if (confirmDelete) {
      this.http.delete<UsersApiResponse>(`${URL}/books/${id}`).subscribe({
        next: (response) => {
          this.message.set(response.message);
          this.showToastSuccess();
          location.reload();
          console.log('genres', this._books());
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
          this.showToastDanger();
        },
      });
    }
  }

  onBookEdit(id: number) {
    this.router.navigateByUrl(`admin/books/edit/${id}`);
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
