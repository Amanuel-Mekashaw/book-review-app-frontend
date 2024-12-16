import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-element-found',
  standalone: true,
  imports: [],
  templateUrl: './NoElementFound.component.html',
  styleUrl: './NoElementFound.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoBooksFoundComponent {
  @Input() noBookFound!: boolean;
  @Input() amountOfBooks!: number;
  @Input() element!: string;
}
