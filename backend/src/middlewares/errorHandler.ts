import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
    console.log(`Error Path ${req.path}`, error);
    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error")
}

export default errorHandler;
