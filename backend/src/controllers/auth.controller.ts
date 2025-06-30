import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchError";
import { z } from "zod";
import { createAccount } from "../services/auth.service";
import { CREATED } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";


const registerSchema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional()
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }
)


export const registerHandler = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
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