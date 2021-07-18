var express = require("express");
var router = express.Router();
var con = require("../config/connection.js")

router.route("/").get(function (req, res) {
    res.render("pages/admin/emplogin");
  });
  router.route("/eindex").get(function (req, res) {
    res.render("pages/admin/eindex");
  });
  
  router.route("/empctl").get(function (req, res) {
    var id = "";
    var id = req.query.id;
    var filter = "";
    if (id) {
      filter = " where id = ?";
    }
    console.log(id);
    con.query(
      "select * from stuBeat.sbemployee" + filter,
      id,
      function (err, data) {
        if (err) {
          res.send(err);
        } else {
          console.log(data);
          res.render("./pages/admin/empctl.ejs", { data: data });
        }
      }
    );
  });
  
  router.route("/memberctl").get(function (req, res) {
    var id = "";
    var id = req.query.id;
    var filter = "";
    if (id) {
      filter = " where id = ?";
    }
    console.log(id);
    con.query(
      "select * from stuBeat.sbmember" + filter,
      id,
      function (err, data) {
        if (err) {
          res.send(err);
        } else {
          console.log(data);
          res.render("./pages/admin/memberctl.ejs", { data: data });
        }
      }
    );
  });
  router.route("/memberctl/mmusic/").get(function (req, res) {
    var id = req.query.id;
    console.log(id);
    con.query(
      "select * from stuBeat.sbmusic where id = ?",
      id,
      function (err, data) {
        res.render("pages/admin/mmusic", { data: data });
      }
    );
  });

module.exports = router;
