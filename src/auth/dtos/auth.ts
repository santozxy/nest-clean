export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}
export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date; // Optional, for additional user metadata
  updatedAt: Date; // Optional, for additional user metadata
}
