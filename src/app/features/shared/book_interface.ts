export interface Genre {
  id: number;
  name: string;
  description: string;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  genres: Genre[]; // Array of Genre objects
  coverImage: string;
  averageRating: number;
  ratingCount: number;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
}

export interface SingleBookApiError {
  message: string;
  code: number;
  data: {
    [key: string]: string; // Represents additional properties as key-value pairs
  };
}
