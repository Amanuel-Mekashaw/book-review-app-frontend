import { Book, Pageable, Sort } from '../../book.interface';

import { AuthorDetails } from '../Auth/user.interface';

export type Authorities = {
  authority: string;
};

export type User = {
  id: number;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN' | 'AUTHOR';
  status: 'ACTIVE' | 'INACTIVE';
  collections: string[];
  authorDetails: AuthorDetails;
  createdAt: string;
  updatedAt: string;
  authorities: Authorities[];
  username: string;
  password: string;
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
};

export type Author = {
  id: number;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  collections: string[];
  authorDetails: AuthorDetails;
  createdAt: string;
  updatedAt: string;
  authorities: Authorities[];
  username: string;
  password: string;
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
};

// ---------------------------------------------------

// Root type
export interface CollectionApiResponse {
  message: string;
  code: number;
  data: Collection[];
}

export interface CollectionApiResponseAll {
  message: string;
  code: number;
  data: Data;
}

export interface Data {
  content: Collection[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  books: Book[];
  user: {
    id: number;
  };
  private: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Authority {
  authority: string;
}

export interface CollectionCreateApiResponse {
  message: string;
  code: number;
  data: Collection | null;
}
