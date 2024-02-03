import { UserM } from '@domain/model/user';

export interface CreateUser {
  name: string;
  email: string;
  photo?: string;
  isEmailVerified: boolean;
  lastLogin: Date;
}

export interface UserRepository {
  getUser(email: string): Promise<UserM>;
  getUserByEmail(email: string): Promise<UserM>;
  createUser(data: CreateUser): Promise<UserM>;
  setHashnodePat(id: string, hashnodePat: string): Promise<UserM>;
  updateLastLogin(email: string): Promise<void>;
}
