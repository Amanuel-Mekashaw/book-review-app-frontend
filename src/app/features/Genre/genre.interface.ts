import { Genre } from '../../genre.interface';

export interface GenreApiResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Genre[];
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SortInfo {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: SortInfo;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface GenrePostResponse {
  message: 'string';
  code: 0;
  data: Genre;
}
