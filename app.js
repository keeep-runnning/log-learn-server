import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import BusinessError from "./errors/BusinessError.js";
import passportConfig from "./passport/index.js";
import config from "./config.js";

import usersRouter from "./router/users.js";
import authRouter from "./router/auth.js";
import postsRouter from "./router/posts.js";
import settingsRouter from "./router/settings.js";

const app = express();

passportConfig();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);
app.use(morgan(config.morgan.format));
app.use(express.json());
app.use(cookieParser(config.cookie.secret));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: config.cookie.secret,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/settings", settingsRouter);

app.use((req, res, next) => {
  const notFoundError = new BusinessError({
    message: `[${req.method}] [${req.url}] 존재하지 않는 경로입니다.`,
    statusCode: 404,
    errorCode: "common-005",
  });
  next(notFoundError);
});

app.use((error, req, res, next) => {
  console.error("error:", error.message);
  if (error instanceof BusinessError) {
    return res.status(error.statusCode).json({
      code: error.errorCode,
      errorMessage: error.message,
      errors: error.errors,
    });
  }
  res.status(500).json({
    code: "common-004",
    errorMessage: "서버에 문제가 발생했습니다.",
    errors: [],
  });
});

app.listen(config.host.port, () => {
  console.log(`log-learn server is ready on ${config.host.port} port`);
});
