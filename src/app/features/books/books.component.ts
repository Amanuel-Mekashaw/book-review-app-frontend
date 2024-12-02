import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BooksListsComponent } from '../Homepage/components/BooksList/lists.component';
import { HlmSelectModule } from '../../../lib/ui-select-helm/src/index';
import { HlmSelectTriggerComponent } from '../../../lib/ui-select-helm/src/lib/hlm-select-trigger.component';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [
    HlmSelectImports,
    HlmButtonDirective,
    BooksListsComponent,
    HlmSelectModule,
    HlmSelectTriggerComponent,
    BrnSelectImports,
    HlmInputDirective,
  ],
  providers: [BooksComponent],
  standalone: true,
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    if (this.authService.currentUserSignal === null) {
      this.router.navigateByUrl('/login');
    }
  }
}
