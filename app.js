const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");

const { sequelize } = require("./models");
const { BusinessError } = require("./errors/BusinessError");
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

app.use(cors({
  origin: true,
  credentials: true
}));
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
  const notFoundError = new BusinessError({
    message: `[${req.method}] [${req.url}] 존재하지 않는 경로입니다.`,
    statusCode: 404,
    errorCode: "common-005"
  });
  next(notFoundError);
});

app.use((error, req, res, next) => {
  console.error("error:", error.message);
  if(error instanceof BusinessError) {
    return res.status(error.statusCode)
      .json({
        code: error.errorCode,
        errorMessage: error.message,
        errors: error.errors
      });
  }
  res.status(500).json({
    code: "common-004",
    errorMessage: "서버에 문제가 발생했습니다.",
    errors: []
  });
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}...`);
});
