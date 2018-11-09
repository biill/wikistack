const express = require('express');
const router = express.Router();
const {Page} = require('../models')

const {addPage} = require('../views');
const {wikiPage} = require('../views')
const bodyParser = require('body-parser')

router.use(bodyParser());
router.get('/', (req,res) => {

});

router.post('/', async (req, res, next) => {
    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`
    const page = new Page({
      title: req.body.title,
      content: req.body.content,
      email: req.body.content,
      status: 'open'
    });
  
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise.
    try {
      await page.save();
      res.redirect(`/wiki/${page.slug}`);
    } catch (error) { next(error) }
  });

router.get('/add', (req,res) => {
    res.send(addPage());
});

router.get('/:slug', async(req, res, next) => {
  let searchSlug = req.params.slug;
  console.log(req.params, searchSlug, "--------------------------");
  let currentPage = await Page.findAll({where: {slug:searchSlug}});
  console.log(currentPage, "**********************");
  res.send(wikiPage(currentPage[0]));
});

module.exports = router;