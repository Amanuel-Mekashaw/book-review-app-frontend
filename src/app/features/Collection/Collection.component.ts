import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [],
  templateUrl: './Collection.component.html',
  styleUrl: './Collection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent { }
