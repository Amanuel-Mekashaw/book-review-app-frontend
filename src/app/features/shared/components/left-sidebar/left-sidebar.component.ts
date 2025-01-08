import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface Links {
  routeLink: string;
  icon: string;
  label: string;
  class?: string;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  links = input.required<Links[]>();

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
