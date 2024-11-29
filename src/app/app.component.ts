import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { URL } from './features/shared/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BrnSelectImports,
    HlmSelectImports,
    FormsModule,
    CommonModule,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'bookreviewapp';

  ngOnInit(): void {}
}
