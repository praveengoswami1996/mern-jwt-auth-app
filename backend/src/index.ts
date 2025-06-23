import "dotenv/config";
import express, { Request } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
// import errorHandler from "./middleware/errorHandler";
// import authenticate from "./middleware/authenticate";
// import authRoutes from "./routes/auth.route";
// import userRoutes from "./routes/user.route";
// import sessionRoutes from "./routes/session.route";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middlewares/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// Server health check
app.get("/", async (req, res, next) => {
  res.status(OK).json({
    status: "healthy",
  });
  return;
});

app.use("/auth", authRoutes);

// global error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
