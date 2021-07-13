var express = require('express');
var router = express.Router();
var connection = require('../config/connection.js');
const passport = require('passport');


var islogin = false;
var checkloginStatus = function (req, res) {
    islogin = false;
    if (req.isAuthenticated()) {
        islogin = true;
    };
};

var loggedin = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}


router.route('/signup').post(passport.authenticate('local-signup', {
    successRedirect: 'http://localhost:3000/account/login',
    failureRedirect: 'http://localhost:3000/account/login',
    failureFlash: true
}));

// router.route('/signup').post(passport.authenticate('local-signup', 
//     function (req, res) {
//         res.send(req);
// }));

router.route('/login').post(passport.authenticate('local-login', {
    // successRedirect: 'http://localhost:3000/account/login',
    failureRedirect: 'http://localhost:3000/account/login',
    failureFlash: true
}), function (req, res) {
    console.log(req);
    console.log(req.user);
    res.send(req.user);
});

module.exports = router;