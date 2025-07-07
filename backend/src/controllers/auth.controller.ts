import { Request, Response } from "express";
import catchErrors from "../utils/catchError";
import { createAccount, loginUser, refreshUserAccessToken } from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

export const registerHandler = catchErrors(
    async (req: Request, res: Response) => {
        // Step 1: Validate the request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        })
        // Step 2: Call service
        const { user, accessToken, refreshToken } = await createAccount(request);

        // Step 3: Return response
        return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user);
    }
)

export const loginHandler = catchErrors(
    async (req: Request, res: Response) => {
        // Step 1: Validate the request
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        });

        // Step 2: Call service
        const { accessToken, refreshToken, user } = await loginUser(request);

        // Step 3: Return response
        return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
            message: "Login successful"
        });
    }
)

export const logoutHandler = catchErrors(
    async (req: Request, res: Response) => {
        // Step 1: Get the accessToken from the request cookies
        const accessToken = req.cookies.accessToken as string|undefined;

        // Step 2: Check if the accessToken is valid, if it is valid then delete the session assigned to it
        const { payload } = verifyToken(accessToken || "");

        // Step 3: If there is a payload, then delete the session.
        if(payload) {
            await SessionModel.findByIdAndDelete(payload.sessionId);
        }

        // Step 4: Clear the cookies
        return clearAuthCookies(res).status(OK).json({
            message: "Logout successful"
        })
    }
)

export const refreshHandler = catchErrors(
    async (req: Request, res: Response) => {
        // Step 1: Get the refreshToken from the request cookies
        const refreshToken = req.cookies.refreshToken as string|undefined;
        appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

        // Step 2: Refresh the Token
        const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

        if(newRefreshToken) {
            res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());  
        }

        return res
            .status(OK)
            .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
            .json({
                message: "Access token refreshed"
            });
    }
)