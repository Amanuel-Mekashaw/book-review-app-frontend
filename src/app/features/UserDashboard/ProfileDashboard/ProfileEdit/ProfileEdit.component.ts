import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ProfileFormComponent } from '../ProfileForm/ProfileForm.component';
import { AuthService } from '../../../Auth/auth.service';
import { HeroHeaderComponent } from '../../../shared/components/HeroHeader/HeroHeader.component';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ProfileFormComponent, HeroHeaderComponent],
  templateUrl: './ProfileEdit.component.html',
  styleUrl: './ProfileEdit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileEditComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.currentUserDetail !== null) {
      this.authService.currentUserDetail.set(
        JSON.parse(atob(localStorage.getItem('userDetail'))),
      );
      console.log(this.authService.currentUserDetail());
    }
  }
}
