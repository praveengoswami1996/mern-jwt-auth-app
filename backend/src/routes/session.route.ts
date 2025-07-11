import { Router } from "express";
import { deleteSessionHandler, getSessionsHandler } from "../controllers/session.controller";

const sessionRoutes = Router();

//Prefix: /sessions
sessionRoutes.get("/", getSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);

export default sessionRoutes;