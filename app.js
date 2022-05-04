const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

const { sequelize } = require("./models");
const passportConfig = require("./passport");
const usersRouter = require("./routers/users");
const authRouter = require("./routers/auth");

const app = express();

dotenv.config();
passportConfig();

app.set("port", process.env.PORT || 8080);

sequelize.sync({ force: false })
  .then(() => console.log("database is connected..."))
  .catch((error) => console.error(error));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  const notFoundError = new Error(`[${req.method}] [${req.url}] router does not exist.`);
  notFoundError.status = 404;
  notFoundError.code = "common-005";
  next(notFoundError);
});

app.use((error, req, res, next) => {
  console.error("error:", error.message);
  res.status(error?.status ?? 500).json({
    code: error?.code ?? "common-004",
    errorMessage: error?.message ?? "서버에 문제가 발생했습니다.",
    errors: error?.errors ?? []
  });
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}...`);
});
