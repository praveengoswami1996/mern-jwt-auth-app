import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller";

const userRoutes = Router();

//Prefix: /user
userRoutes.get("/", getUserHandler);

export default userRoutes;