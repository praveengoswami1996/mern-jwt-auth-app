import { Request, Response } from "express";
import catchErrors from "../utils/catchError";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";

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