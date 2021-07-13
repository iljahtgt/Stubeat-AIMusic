var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy
var connection = require('./connection.js');

module.exports = function (passport) {

    // 序列化
    passport.serializeUser(function (user, done) {
        console.log(user);
        console.log(user.id, user.username);
        done(null, user.id);
    });
    // 反序列化
    passport.deserializeUser(function (id, done) {

        connection.query(`select * from useracc where id = ? `, [id], function (err, result) {
            console.log(result);
            return done(err, result);
        });
        //   done(null,user);

    });

    // Sign up
    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
                // console.log(username,password);
                // console.log(req);
                connection.query("select * from userinfo.useracc where username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'User existed'));
                    } else {
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null),

                        };
                        var insertQuery = "insert into useracc ( username, password) values(?, ?)";
                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function (err, result) {
                            newUserMysql.id = result.insertId;
                            console.log(username, password);
                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    // Log in
    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
                console.log(req.boady);
                connection.query('select * from useracc where username = ?', [username], function (err, rows) {
                    if (err)
                        return done(err)
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user'));
                    }

                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Wrong passsword'));
                    
                    return done(null, rows[0]);
                });
            })
    )


};