import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "./config.js";
import AppError from "./error/AppError.js";
import NotFoundError from "./error/common/NotFoundError.js";

import userRouter from "./router/user.js";
import authRouter from "./router/auth.js";
import postRouter from "./router/post.js";

const app = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);
app.use(morgan(config.morgan.format));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.use(() => {
  throw new NotFoundError();
});

app.use((error, req, res, next) => {
  console.error("on error handler:", error);
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorMessage: error.message,
      errors: error.errors,
    });
  }
  res.status(500).json({
    errorMessage: "서버에 문제가 발생했습니다",
    errors: [],
  });
});

app.listen(config.host.port, () => {
  console.log(`log-learn server is ready on ${config.host.port} port`);
});
