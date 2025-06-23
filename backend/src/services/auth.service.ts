import { CONFLICT } from "../constants/http";
import UserModel from "../models/user.model";

type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

/*
    Business Logic of Create Account Function
    1. Verify user doesn't already exists (email not taken)
    2. Create User
    3. Create Verification Code
    4. Send Verification Email
    5. Create Session
    6. Sign Access Token and Refresh Token
    7. Return Created User and Tokens
*/
export const createAccount = async (data: CreateAccountParams) => {
    // 1. Verify user doesn't already exists (email not taken)
    const existingUser = await UserModel.exists({ email: data.email });
    if(existingUser) {
      throw new Error("User already exists");
    }

    // 2. Create User
    const user = await UserModel.create({
      email: data.email,
      password: data.password
    })

    // 3. Create Verification Code 
};