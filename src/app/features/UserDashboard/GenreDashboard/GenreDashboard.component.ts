import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { ProfileFormComponent } from './GenreForm/GenreForm.component';

@Component({
  selector: 'app-genre-dashboard',
  standalone: true,
  imports: [HeroHeaderComponent, ProfileFormComponent],
  templateUrl: './GenreDashboard.component.html',
  styleUrl: './GenreDashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreDashboardComponent {}
