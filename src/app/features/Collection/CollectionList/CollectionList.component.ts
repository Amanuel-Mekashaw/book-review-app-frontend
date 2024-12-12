import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CollectionCardComponent } from '../CollectionCard/CollectionCard.component';
import { Collection } from '../collection.interface';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CollectionCardComponent],
  templateUrl: './CollectionList.component.html',
  styleUrl: './CollectionList.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent {
  @Input() collections!: Collection[];
  @Input() delete: boolean;
  @Input() edit: boolean;
}
