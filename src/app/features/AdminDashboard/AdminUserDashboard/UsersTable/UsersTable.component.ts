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
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs';
import { User, UsersApiResponse } from '../../../Auth/user.interface';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';
import { ApiError } from '../../../../book.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL } from '../../../shared/constants';
import { HlmToasterComponent } from '../../../../../lib/ui-sonner-helm/src/lib/hlm-toaster.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-dashboard-table',
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
    LoadingStateComponent,
    ErrorStateComponent,
    CommonModule,
    HlmToasterComponent,
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
  templateUrl: './UsersTable.component.html',
  styleUrls: ['./UsersTable.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTable implements OnInit, OnChanges {
  http = inject(HttpClient);
  router = inject(Router);

  users = signal<User[] | null | undefined>(null);
  error = signal<string>('');
  loading = signal(false);
  message = signal('');

  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300)),
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<User>(true);
  protected readonly _isUserSelected = (user: User) =>
    this._selectionModel.isSelected(user);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map((change) => change.source.selected)),
    {
      initialValue: [],
    },
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    id: { visible: true, label: 'ID' },
    username: { visible: true, label: 'User name' },
    role: { visible: true, label: 'Role' },
    status: { visible: true, label: 'status' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private _users = signal([]);
  private _filteredUsers = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._users().filter((user) =>
        user.username.toLowerCase().includes(emailFilter),
      );
    }
    return this._users();
  });

  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedUsers = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const users = this._filteredUsers();
    if (!sort) {
      return users.slice(start, end);
    }
    return [...users]
      .sort(
        (p1, p2) =>
          (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email),
      )
      .slice(start, end);
  });

  protected readonly _allFilteredPaginatedUsersSelected = computed(() =>
    this._filteredSortedPaginatedUsers().every((users) =>
      this._selected().includes(users),
    ),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedUsersSelected()
      ? true
      : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<User> = (
    _: number,
    user: User,
  ) => user.id;
  protected readonly _totalElements = computed(
    () => this._filteredUsers().length,
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected toggleUser(users: User) {
    this._selectionModel.toggle(users);
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
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }

  fetchUsers() {
    this.http.get<UsersApiResponse>(`${URL}/auth/all`).subscribe({
      next: (response) => {
        this.loading.set(true);
        this.users.set(response.data);
        this._users.set(response.data);
        this.loading.set(false);
        console.log('users', this._users());
      },
      error: (error: ApiError) => {
        // console.log('error', error);
        this.error.set(error.message);
      },
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  onUserDelete(id: number) {
    console.log('User id', id);

    this.http.delete<UsersApiResponse>(`${URL}/auth/delete/${id}`).subscribe({
      next: (response) => {
        this.message.set(response.message);
        this.showToastSuccess();
        location.reload();
        console.log('users', this._users());
      },
      error: (error: ApiError) => {
        this.error.set(error.message);
        this.showToastDanger();
      },
    });
  }

  onUserAssignRole(username: string, role: string, id: number) {
    console.log({
      username: username,
      role: role,
    });
    this.http
      .post<UsersApiResponse>(`${URL}/auth/assign-role`, {
        username: username,
        role: role,
      })
      .subscribe({
        next: (response) => {
          this.message.set(response.message);
          this.showToastSuccess();
          this.fetchUsers();
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
          this.showToastDanger();
        },
      });
  }

  onUserEdit(id: number) {
    console.log('edited user with id ', id);
    this.router.navigateByUrl(`admin/profile/edit/${id}`);
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
