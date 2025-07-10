import { APP_ORIGIN } from "../constants/env";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import sendMail from "../utils/sendMail";

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

  // 4. Send Verification Email
  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url)
  })
  
  if(error) {
    console.log(error);
  }

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

export const verifyEmail = async (code: string) => {
  // Step 1: Get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() }
  })
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code")
  
  // Step 2: Update user to verified true
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true }
  )
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email")

  // Step 3: Delete verification code
  await validCode.deleteOne();
  
  // Step 4: return user
  return {
    user: updatedUser.omitPassword()
  }
}

export const sendPasswordResetEmail = async (email: string) => {
  // Step 1: Get the user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, "User not found");

  // Step 2: Check email rate limit
  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo }
  })

  appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many requests, please try again later")

  // Step 3: Create verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt
  })

  // Step 4: Send verification email
  const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url)
  });

  appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`)

  // Step 5: Return
  return {
    url,
    emailId: data.id
  }
}
