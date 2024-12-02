import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'books',
      icon: 'fal fa-solid fa-book',
      label: 'Books',
    },

    {
      routeLink: 'genres',
      icon: 'fal fa-solid fa-masks-theater',
      label: 'Genres',
    },
    {
      routeLink: 'collections',
      icon: 'fal fa-solid fa-rectangle-list',
      label: 'Collections',
    },
    {
      routeLink: 'profile',
      icon: 'fal fa-regular fa-user ',
      label: 'Profile',
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
