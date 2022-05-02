const express = require("express");
const morgan = require("morgan");

const { sequelize } = require("./models");
const usersRouter = require("./routers/users");

const app = express();
app.set("port", process.env.PORT || 8080);

sequelize.sync({ force: false })
  .then(() => console.log("database is connected..."))
  .catch((error) => console.error(error));

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  const notFoundError = new Error(`[${req.method}] [${req.url}] router does not exist.`);
  notFoundError.status = 404;
  next(notFoundError);
});

app.use((error, req, res, next) => {
  console.error("error:", error.message);
  res.status(error.status ?? 500).send();
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}...`);
});
