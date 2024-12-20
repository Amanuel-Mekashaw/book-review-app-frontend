import { User } from './features/Auth/user.interface';

export interface Rating {
  id: number;
  ratingValue: number;
  comment: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface RatingApiResponse {
  message: string;
  code: number;
  data: Rating[];
}
