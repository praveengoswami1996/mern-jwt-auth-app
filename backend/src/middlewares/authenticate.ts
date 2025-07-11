import { NextFunction, Request, Response } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";
import mongoose from "mongoose";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken as string|undefined;
    appAssert(
        accessToken, 
        UNAUTHORIZED, 
        "Not authorized", 
        AppErrorCode.InvalidAccessToken
    )

    const { error, payload } = verifyToken(accessToken);
    appAssert(
        payload, 
        UNAUTHORIZED,
        error === "jwt expired" ? "Token expired" : "Invalid token",
        AppErrorCode.InvalidAccessToken
    )

    //Setting userId and sessionId to the request
    req.userId = payload.userId as mongoose.Types.ObjectId;
    req.sessionId = payload.sessionId as mongoose.Types.ObjectId;

    next();
}

export default authenticate;