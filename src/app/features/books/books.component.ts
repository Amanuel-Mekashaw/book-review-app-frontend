import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ListsComponent } from '../Homepage/components/lists/lists.component';
import { HlmSelectModule } from '../../../lib/ui-select-helm/src/index';
import { HlmSelectTriggerComponent } from '../../../lib/ui-select-helm/src/lib/hlm-select-trigger.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  imports: [
    HlmSelectImports,
    HlmButtonDirective,
    ListsComponent,
    HlmSelectModule,
    HlmSelectTriggerComponent,
    BrnSelectImports,
    HlmInputDirective,
    FooterComponent,
  ],
  providers: [BooksComponent],
  standalone: true,
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent {}
