const express = require("express");

const app = express();
app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
  res.send("express");
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}...`);
});
