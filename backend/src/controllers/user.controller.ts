import { Request, Response } from "express";
import catchErrors from "../utils/catchError";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { NOT_FOUND, OK } from "../constants/http";

export const getUserHandler = catchErrors(
    async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.userId);
        appAssert(user, NOT_FOUND, "User not found");
        return res.status(OK).json(user.omitPassword());
    }
)