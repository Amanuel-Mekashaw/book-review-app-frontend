import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { GenresTable } from './GenreTable/GenreTable.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-genre',
  standalone: true,
  imports: [HeroHeaderComponent, GenresTable, HlmButtonDirective, RouterLink],
  templateUrl: './AdminGenre.component.html',
  styleUrl: './AdminGenre.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGenreComponent {}
