export interface UserInterface {
  email: string;
  token: string;
  username: string;
}

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  code: number;
  data: {
    token: string;
    user: User;
  };
};

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN' | string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  authorDetails: AuthorDetails;
  createdAt: string;
  updatedAt: string;
  authorities: {
    authority: string;
  }[];
  username: string;
  password: string;
  enabled: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface UsersApiResponse {
  message: string;
  code: number;
  data: User[] | null;
}

export interface AuthorDetails {
  id: number;
  firstName: string;
  lastName: string;
  user: string;
  profilePicture: string;
  biography: string;
  socialLinks: string[];
}

export interface AuthorDetailsResponse {
  message: string;
  code: number;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    user: User;
    profilePicture: string;
    biography: string;
    socialLinks: string[];
  };
}

export type AuthError = {
  message: string;
  code: number;
  data: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
};
