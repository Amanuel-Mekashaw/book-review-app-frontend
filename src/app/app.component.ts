import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { HlmPDirective } from '@spartan-ng/ui-typography-helm';

import {
  HlmPaginationContentDirective,
  HlmPaginationDirective,
  HlmPaginationEllipsisComponent,
  HlmPaginationItemDirective,
  HlmPaginationLinkDirective,
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';

type ItemProps = {
  id: number;
  title: string;
  date: number;
  description: string;
  image: string;
  link: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HlmInputDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    BrnSelectImports,
    HlmSelectImports,
    HlmButtonDirective,
    HlmPaginationContentDirective,
    HlmPaginationDirective,
    HlmPaginationEllipsisComponent,
    HlmPaginationItemDirective,
    HlmPaginationLinkDirective,
    HlmPaginationNextComponent,
    HlmPaginationPreviousComponent,
    HlmPDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'bookreviewapp';

  items: ItemProps[] = [
    {
      id: 1,
      title: 'Souls',
      description:
        'Is simply dummy text of the printing and typesetting industry.',
      date: new Date().getFullYear(),
      image:
        'https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg',
      link: 'https://www.goodreads.com/book/show/8667848-a-discovery-of-witches?ref=nav_sb_ss_1_5',
    },
    {
      id: 2,
      title: 'Harry Potter and the Cursed Child',
      description:
        'Is simply dummy text of the printing and typesetting industry.',
      date: new Date().getFullYear(),
      image:
        'https://bukovero.com/wp-content/uploads/2016/07/Harry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg',
      link: '',
    },
    {
      id: 3,
      title: 'The great gatsby',
      description:
        'Is simply dummy text of the printing and typesetting industry.',
      date: new Date().getFullYear(),
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMBe97jZk0iaa61yMK-ZOFiHiTAGTHTMSNSg&s',
      link: 'https://www.goodreads.com/book/show/4671.The_Great_Gatsby?ac=1&from_search=true&qid=Nilyhf8Rs3&rank=1',
    },
  ];
}
