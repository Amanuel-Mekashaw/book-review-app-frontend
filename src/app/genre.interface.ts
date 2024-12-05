import { Pageable, Sort } from './book.interface';

export interface Genre {
  id: number;
  name: string;
  description: string;
}

export interface GenreResponse {
  totalPages: 0;
  totalElements: 0;
  size: 0;
  content: Genre[];
  number: 0;
  sort: Sort;
  numberOfElements: 0;
  pageable: Pageable;
  first: true;
  last: true;
  empty: true;
}
