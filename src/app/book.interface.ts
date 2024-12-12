import { User } from './features/Auth/user.interface';
import { Genre } from './genre.interface';

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  author?: User;
  genres: Genre[];
  coverImage: string;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookRequest {
  id: number;
  title: string;
  isbn: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  author?: User;
  genreIds: number[];
  coverImage: string;
  averageRating: number;
  ratingCount: number;
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

export type BookResponseByAuthor = {
  message: string;
  code: number;
  data: BookByAuthor[];
};

export type BookByAuthor = {
  id: number;
  title: string;
  isbn: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  author: Author;
  genres: Genre[];
  coverImage: string;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
};

type Author = {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  password: string;
  authorities: Authority[];
  username: string;
  enabled: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
};

type Authority = {
  authority: string;
};
