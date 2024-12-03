import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-header',
  standalone: true,
  imports: [],
  templateUrl: './HeroHeader.component.html',
  styleUrl: './HeroHeader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroHeaderComponent {
  @Input() title!: string;
  @Input() subtitle: string;
}
