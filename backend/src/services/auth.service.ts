import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";

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

  appAssert(!existingUser, CONFLICT, "Email already in use");

  // 2. Create User
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const userId = user._id;

  // 3. Create Verification Code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // 4. Send Verification Email (Will do it later)

  /*
      5. Create Session
      => A session is gonna represent a unit of time that a user is logged-in for.
      So when a user logs in to our app, it will create a session that will be valid for 30 days.
      And that user will be able to use the AccessToken and RefreshToken to stay logged in to that particular session for 30 days.
      And that refreshToken that is generated will be used to refrest the accessToken for that particular session. So if the session is removed then the refreshToken will no longer be valid.
    */
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  // 6. Create and sign accessToken and refreshToken
  const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions);

  const accessToken = signToken({ userId, sessionId: session._id });

  // 7. Return Created User and Tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // Step 1: Check if a user exists with email
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  // Step 2: User exists, now validate the password
  const isValidPassword = await user.comparePassword(password);
  appAssert(isValidPassword, UNAUTHORIZED, "Invalid email or password");

  // Step 3: User is valid now create the session
  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  // Step 4: Create and sign accessToken and refreshToken
  const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions);

  const accessToken = signToken({ userId, sessionId: session._id });

  // Step 5: Return user & Tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  } 
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  // Step 1: Check if the refreshToken is valid
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  })
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  // Step 2: Check if the session exists
  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now, 
    UNAUTHORIZED, 
    "Session expired"
  );

  // Step 3: Refrest the session if it expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;
  
  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken
  }
}
