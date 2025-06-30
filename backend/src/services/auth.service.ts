import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

export type CreateAccountParams = {
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
    6. Create and sign Access Token and Refresh Token
    7. Return Created User and Tokens
*/
export const createAccount = async (data: CreateAccountParams) => {
    // 1. Verify user doesn't already exists (email not taken)
    const existingUser = await UserModel.exists({ email: data.email });
    
    appAssert(!existingUser, CONFLICT, "Email already in use")

    // 2. Create User
    const user = await UserModel.create({
      email: data.email,
      password: data.password
    })

    // 3. Create Verification Code
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow()
    }) 

    // 4. Send Verification Email (Will do it later)

    
    /*
      5. Create Session
      => A session is gonna represent a unit of time that a user is logged-in for.
      So when a user logs in to our app, it will create a session that will be valid for 30 days.
      And that user will be able to use the AccessToken and RefreshToken to stay logged in to that particular session for 30 days.
      And that refreshToken that is generated will be used to refrest the accessToken for that particular session. So if the session is removed then the refreshToken will no longer be valid.
    */
    const session = await SessionModel.create({
      userId: user._id,
      userAgent: data.userAgent
    })

    // 6. Create and sign accessToken and refreshToken
    const refreshToken = jwt.sign(
      { sessionId: session._id },
      JWT_REFRESH_SECRET,
      { audience: ['user'], expiresIn: "30d" }
    )

    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      JWT_SECRET,
      { audience: ['user'], expiresIn: "15m" }
    )

    // 7. Return Created User and Tokens
    return {
      user: user.omitPassword(),
      accessToken,
      refreshToken
    }
};