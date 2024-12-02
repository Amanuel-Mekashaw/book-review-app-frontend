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
    user: {
      id: number;
      email: string;
      passwordHash: string;
      role: 'USER' | 'ADMIN' | string;
      status: 'ACTIVE' | 'INACTIVE' | string;
      authorDetails: {
        id: number;
        firstName: string;
        lastName: string;
        user: string;
        profilePicture: string;
        biography: string;
        socialLinks: string[];
      };
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      authorities: {
        authority: string;
      }[];
      username: string;
      password: string;
      enabled: boolean;
      accountNonExpired: boolean;
      credentialsNonExpired: boolean;
      accountNonLocked: boolean;
    };
  };
};

export type AuthError = {
  message: string;
  code: number;
  data: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
};
