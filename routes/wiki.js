const express = require("express");
const router = express.Router();
const { Page, User } = require("../models");

const { addPage } = require("../views");
const { wikiPage } = require("../views");
const bodyParser = require("body-parser");

router.use(bodyParser());
router.get("/", (req, res) => {});

router.post("/", async (req, res, next) => {
  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
    status: "open"
  });

  const currentUser = User.findAll({
    where: {
      name: req.body.name
    }
  });
  let user=currentUser[0]
  if (!user) {
      user = new User({
      name: req.body.name,
      email: req.body.email,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  } else {
    user.updatedAt = Date.now();
  }

 


  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise.
  try {
    await page.save();
    await user.save();
    page.setAuthor(user);
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get("/add", (req, res) => {
  res.send(addPage());
});

router.get("/:slug", async (req, res, next) => {
  let searchSlug = req.params.slug;

  let currentPage = await Page.findAll({ where: { slug: searchSlug } });
  let author=await User.findById(currentPage[0].authorId);
 
  res.send(wikiPage(currentPage[0],author.name));
});

module.exports = router;
