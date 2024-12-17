import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { GenresTable } from './GenreTable/GenreTable.component';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-admin-genre',
  standalone: true,
  imports: [HeroHeaderComponent, GenresTable, HlmButtonDirective],
  templateUrl: './AdminGenre.component.html',
  styleUrl: './AdminGenre.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGenreComponent {}
