import type { CreateUserInput, UpdateUserInput, User } from "../entities.ts";

export interface Users {
  listUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(id: string, input: UpdateUserInput): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
