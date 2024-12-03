export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  genres: Genre[];
  coverImage: string;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface BookResponse {
  content: Book[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ApiError {
  message: string;
  code: number;
  data: {
    [key: string]: string;
  };
}