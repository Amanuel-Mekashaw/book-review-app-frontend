import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { ListsComponent } from './features/Homepage/components/lists/lists.component';
import { NavbarComponent } from './features/shared/components/navbar/navbar.component';
import { PaginationComponent } from './features/Homepage/components/pagination/pagination.component';
import { FooterComponent } from './features/shared/components/footer/footer.component';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './features/shared/components/layout/layout.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HlmInputDirective,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonDirective,
    ListsComponent,
    NavbarComponent,
    PaginationComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    LayoutComponent,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'bookreviewapp';
}
