var express = require('express');
var router = express.Router();
var con = require('../config/connection.js');
var bcrypt = require('bcrypt');

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
    con.query(sql, data, function (err, result) {
        if (err) {
            res.send({ message: err });
        }
        res.send(result);
    });
});

//

// not done
router.get('/list', function (req, res) {
    var sql = 'SELECT * FROM sbmember';

    con.query(sql, data, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send(result);

    });
});

module.exports = router;