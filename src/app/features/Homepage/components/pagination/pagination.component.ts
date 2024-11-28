import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HlmPaginationContentDirective,
  HlmPaginationDirective,
  HlmPaginationEllipsisComponent,
  HlmPaginationItemDirective,
  HlmPaginationLinkDirective,
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    HlmPaginationContentDirective,
    HlmPaginationDirective,
    HlmPaginationEllipsisComponent,
    HlmPaginationItemDirective,
    HlmPaginationLinkDirective,
    HlmPaginationNextComponent,
    HlmPaginationPreviousComponent,
  ],
  templateUrl: `./pagination.component.html`,
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {}
