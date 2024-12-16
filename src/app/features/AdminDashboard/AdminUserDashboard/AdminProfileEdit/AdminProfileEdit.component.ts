import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AuthorDetailsResponse } from '../../../Auth/user.interface';
import { HttpClient } from '@angular/common/http';
import { ApiError } from '../../../../book.interface';
import { ProfileFormComponent } from '../../../UserDashboard/ProfileDashboard/ProfileForm/ProfileForm.component';
import { URL } from '../../../shared/constants';
import { LoadingStateComponent } from '../../../shared/components/LoadingState/LoadingState.component';
import { ErrorStateComponent } from '../../../shared/components/ErrorState/ErrorState.component';

@Component({
  selector: 'app-admin-profile-edit',
  standalone: true,
  imports: [ProfileFormComponent, LoadingStateComponent, ErrorStateComponent],
  templateUrl: './AdminProfileEdit.component.html',
  styleUrl: './AdminProfileEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfileEditComponent implements OnInit {
  userId = input.required<number | null>();

  http = inject(HttpClient);
  authorLoading = signal(false);
  author = signal<AuthorDetailsResponse | null>(null);
  authorError = signal('');

  ngOnInit(): void {
    console.log('User to be edited', this.userId());
    this.fetchUserDetail();
  }

  fetchUserDetail() {
    this.http
      .get<AuthorDetailsResponse>(
        `${URL}/userdetail/by-authordetail/${this.userId()}`,
      )
      .subscribe({
        next: (response: AuthorDetailsResponse) => {
          this.authorLoading.set(true);
          // console.log('authordetail', response.data);
          this.author.set(response);
          this.authorLoading.set(false);
        },
        error: (error: ApiError) => {
          console.log('error', error);
          this.authorError.set(error.message);
          this.authorLoading.set(false);
        },
      });
  }
}
