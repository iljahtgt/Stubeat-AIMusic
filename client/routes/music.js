var express = require("express");
var router = express.Router();

router.get("/editor", function (req, res, next) {
  res.render("pages/music/editor");
});

router.get("/pro", function (req, res, next) {
  res.render("pages/music/pro");
});

router.get("/remix", function (req, res, next) {
  res.render("pages/music/remix");
});
module.exports = router;
