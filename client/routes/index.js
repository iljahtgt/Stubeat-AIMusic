var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/main/index");
});

router.get("/about", function (req, res, next) {
  res.render("pages/main/about");
});

module.exports = router;
