export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  genres: string[]; // Assuming genres is an array of strings
  coverImage: string;
  averageRating: number;
  ratingCount: number;
  createdAt: string; // ISO date format
  updatedAt: string; // ISO date format
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
