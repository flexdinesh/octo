export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  email: string;
  name: string;
};

export type UpdateUserInput = {
  email?: string;
  name?: string;
};
