var express = require('express');
var router = express.Router();
var con = require('../config/connection.js');
// var bcrypt = require('bcrypt');

// Tsai's Code
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
            res.send({ message: "Something is wrong" })
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

//

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
    con.query(sql, data, (err, result) => {
        if (err) {
            res.send({ message: err });
        }
        res.send(result);
    })
});

// remove music from mysql
router.route("/deleteMusic").post(function (req, res) {
    var sql = "DELETE FROM sbmusic WHERE musicid = ?";
    var data = [req.body.id];
    con.query(sql, data, (err, result) => {
        if(err){
            res.send({message: err});
        }
        res.send(result);
    })
});

module.exports = router;