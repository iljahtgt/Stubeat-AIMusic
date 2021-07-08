var express = require("express");
var router = express.Router();

router.route("/login").get(function (req, res) {
  res.render("pages/account/login");
});

module.exports = router;