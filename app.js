const express = require("express");
const morgan = require("morgan");
const models = require("./models");
const wikiRoutes = require('./routes/wiki');
const userRoutes = require('./routes/user');
const {main} = require('./views')
const {Page} = require('./models')

const app = express();

app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));

app.use('/wiki', wikiRoutes);

app.use('/user', userRoutes);

app.get("/", async (req, res) => {
  let pagesArray = await Page.findAll();
  res.send(main(pagesArray));
});

const init = async () => {
  await models.db.authenticate().then(() => {
    console.log("connected to the database!");
  });

  await models.db.sync({force: true});

  app.listen(3000, () => {
    console.log("Server is running!");
  });
};

init();
