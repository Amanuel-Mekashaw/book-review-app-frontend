import { Book } from './book.interface';
import { User } from './features/Auth/user.interface';

export interface Rating {
  id: number;
  ratingValue: number;
  comment: string;
  user: User;
  book: Book;
  createdAt: string;
  updatedAt: string;
}

export interface RatingApiResponse {
  message: string;
  code: number;
  data: Rating[];
}
