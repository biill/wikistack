const express = require("express");
const morgan = require("morgan");
const models = require("./models");

const app = express();

app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.send(require("./views/layout")(""));
});

const init = async () => {
  await models.db.authenticate().then(() => {
    console.log("connected to the database!");
  });

  await models.db.sync();

  app.listen(3000, () => {
    console.log("Server is running!");
  });
};

init();
