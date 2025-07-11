import { Request, Response } from "express";
import catchErrors from "../utils/catchError";
import SessionModel from "../models/session.model";
import { NOT_FOUND, OK } from "../constants/http";
import appAssert from "../utils/appAssert";

export const getSessionsHandler = catchErrors(
    async (req: Request, res: Response) => {
        // Get all the active sessions of the user
        const sessions = await SessionModel.find(
            {userId: req.userId, expiresAt: { $gt: new Date() }}
        ).select("_id userAgent createdAt").sort({ createdAt: -1 })

        return res.status(OK).json(
            sessions.map((session) => ({
                ...session.toObject(),
                ...(session.id === req.sessionId && {
                    isCurrent: true 
                })
            }))
        )
    }
);

export const deleteSessionHandler = catchErrors(
    async (req: Request, res: Response) => {
        const sessionId = req.params.id;
        const deleted = await SessionModel.findOneAndDelete({
            _id: sessionId,
            userId: req.userId
        })
        appAssert(deleted, NOT_FOUND, "Session not found");

        return res.status(OK).json({
            message: "Session removed"
        })
    }
)