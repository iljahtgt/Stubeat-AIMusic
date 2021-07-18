var express = require("express");
var router = express.Router();

// URI
router.route("/login").get(function (req, res) {
  res.render("pages/account/login");
});

router.route("/member").get(function (req, res) {
  res.render("pages/account/member");
});



module.exports = router;
