import { createContext, useContext } from "react";

type User = {
  _id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserContextType {
  user: User;
}

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = (): User => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside <UserProvider>");
  }
  return context.user;
};

