const express = require("express");
const morgan = require("morgan");

const { sequelize } = require("./models");

const app = express();
app.set("port", process.env.PORT || 8080);

sequelize.sync({ force: false })
  .then(() => console.log("database is connected..."))
  .catch((error) => console.error(error));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("express");
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}...`);
});
