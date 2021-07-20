var express = require("express");
var router = express.Router();
var con = require("../config/connection.js");
// var bcrypt = require('bcrypt');

// login
router.route("/login").post(function (req, res) {
  var sql = "SELECT * FROM sbmember WHERE email = ? AND password = ?";
  var data = [req.body.email, req.body.password];
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

// register
router.route("/signup").post(function (req, res) {
  var sql = "INSERT INTO sbmember (username, password, email) VALUES (?, ?, ?)";
  var data = [req.body.username, req.body.password, req.body.email];
  console.log(req);
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send({ message: "Something is wrong" });
    }
    res.send(result);
  });
});

//email
router.route("/emailCheck").post(function (req, res) {
  var sql = "SELECT email FROM sbmember WHERE email = ?";
  var data = [req.body.email];
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send({ message: err });
    }
    res.send(result);
  });
});


// save trained data
router.route("/saveData").post(function (req, res) {
  console.log(req.body);
  var sql = "INSERT INTO sbmusic (musicname, id, music) VALUE (?, ?, ?)";
  var data = [req.body.musicname, req.body.id, JSON.stringify(req.body.music)];
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send({ message: err });
    }
    res.send(result);
  });
});

// read music from mysql
router.route("/readMusic").post(function (req, res) {
  var sql = "SELECT * FROM sbmusic WHERE id = ?";
  var data = [req.body.id];
  console.log(data);
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send({ message: err });
    }
    console.log(result);
    res.send(result);
  });
});

// remove music from mysql
router.route("/deleteMusic").post(function (req, res) {
  var sql = "DELETE FROM sbmusic WHERE musicid = ?";
  var data = [req.body.id];
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send({ message: err });
    }
    res.send(result);
  });
});

//esignup
router.route("/esignup").post(function (req, res) {
  var sql =
    "INSERT INTO stuBeat.sbemployee (empname, empemail,emppassword ) VALUES (?, ?, ?)";
  var data = [req.body.empname, req.body.empemail, req.body.emppassword];
  console.log(data);
  con.query(sql, data, (err, result) => {
    if (err) {
      res.send({ message: "Something is wrong" });
    }
    console.log(result);
    res.send(result);
  });
});
//emplogin
router.route("/elogin").post(function (req, res) {
  var sql =
    "select * from stuBeat.sbemployee where empemail = ? AND emppassword = ?";
  var user = [req.body.email, req.body.password];
  con.query(sql, user, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// memberctl
//memdelete
router.route("/memdelete").post(function (req, res) {
  var id = req.body.id;
  // console.log(id);
  con.query("delete from sbmember where id = ?", id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//memedit
router.route("/memedit").post(function (req, res) {
  var sql = "update stuBeat.sbmember set ? where id =?";
  var id = req.body.id;
  var data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  con.query(sql, [data, id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//musdelete
router.post("/musdelete", function (req, res) {
  var musicid = req.body.musicid;
  var musicname = req.body.musicname;
  console.log(musicid);
  var sql = "delete from stuBeat.sbmusic where musicid = ?";
  con.query(sql, musicid, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//musedit
router.route("/musedit").put(function (req, res) {
  var sql = "update stuBeat.sbmusic set musicname = ? where musicid =?";
  var musicid = req.body.musicid;
  var musicname = req.body.musicname;
  console.log(req.body.id);
  con.query(sql, [musicname, musicid], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//empdelete
router.route("/empdelete").post(function (req, res) {
  var id = req.body.id;
  // console.log(id);
  con.query("delete from sbemployee where id = ?", id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//empedit
router.route("/empedit").post(function (req, res) {
  var sql = "update stuBeat.sbemployee set ? where id =?";
  var id = req.body.id;
  var data = {
    empname: req.body.empname,
    empemail: req.body.empemail,
    emppassword: req.body.emppassword,
  };
  con.query(sql, [data, id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//AdminemailCheck
router.route("/AdminemailCheck").post(function (req, res) {
  var sql = "SELECT empemail FROM stuBeat.sbemployee WHERE empemail = ?";
  var data = [req.body.empemail];
  con.query(sql, data, (err, result) => {
      if (err) {
          res.send({ message: err });
      }
      console.log(result);
      res.send(result);
  });
});

module.exports = router;
