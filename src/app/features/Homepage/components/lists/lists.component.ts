import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { ListComponent } from '../list/list.component';
import { BooksService } from '../../../../books.service';
import { Book, BookResponse } from '../../../../book_interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

export type ItemProps = {
  id: number;
  title: string;
  date: number;
  description: string;
  image: string;
  link: string | undefined;
};

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ListComponent, CommonModule, LoadingSpinnerComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListsComponent implements OnInit {
  // items: ItemProps[] = [
  //   {
  //     id: 1,
  //     title: 'Souls',
  //     description:
  //       'Is simply dummy text of the printing and typesetting industry.',
  //     date: new Date().getFullYear(),
  //     image:
  //       'https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg',
  //     link: 'https://www.goodreads.com/book/show/8667848-a-discovery-of-witches?ref=nav_sb_ss_1_5',
  //   },
  //   {
  //     id: 2,
  //     title: 'Harry Potter and the Cursed Child',
  //     description:
  //       'Is simply dummy text of the printing and typesetting industry.',
  //     date: new Date().getFullYear(),
  //     image:
  //       'https://bukovero.com/wp-content/uploads/2016/07/Harry_Potter_and_the_Cursed_Child_Special_Rehearsal_Edition_Book_Cover.jpg',
  //     link: '',
  //   },
  //   {
  //     id: 3,
  //     title: 'The great gatsby',
  //     description:
  //       'Is simply dummy text of the printing and typesetting industry.',
  //     date: new Date().getFullYear(),
  //     image:
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMBe97jZk0iaa61yMK-ZOFiHiTAGTHTMSNSg&s',
  //     link: 'https://www.goodreads.com/book/show/4671.The_Great_Gatsby?ac=1&from_search=true&qid=Nilyhf8Rs3&rank=1',
  //   },
  // ];

  books = signal<Book[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe({
      next: (data: BookResponse) => {
        this.books.set(data.content);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load books.');
        this.loading.set(false);
        console.log(err.message);
      },
    });
  }
}
