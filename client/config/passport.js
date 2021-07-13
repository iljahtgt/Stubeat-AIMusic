var LocalStrategy = require('passport-local').Strategy;
// var mysql = require('mysql');

var bcrypt = require('bcrypt-nodejs');
var connection = require('./connection.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config;

module.exports = function (passport) {

        // 序列化
        passport.serializeUser(function (user, done) {
            console.log(user);
            console.log(user.id,user.username);
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

    // Register 註冊
    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
                console.log(req);
                console.log(username,password);
                connection.query("select * from userinfo.useracc where username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'already used'));
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

    // 登入
    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
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
    );

    // facebook
    passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FB,
        clientSecret: process.env.CLIENT_SECRET_FB,
        callbackURL: "http://localhost:3000/auth/facebook/StuBeats"
      },
      function(accessToken, refreshToken, profile, done) {
        connection.query("select * from userinfo.facebook where id = ?",[profile.id],function(err,user){
              if(err){
                  console.log(err);
              }else if(user.length==0){
                  var newUser={
                    id:profile.id,
                    username:profile.displayName,
                    email:profile.email,
                    FB_Private_Chat_ID:'000001100'
                };
                connection.query("insert into userinfo.facebook (id,username,email,FB_Private_Chat_ID) values(?, ?, ?, ?)",newUser,(err,res)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Y R ID:',profile.id,profile.displayName);
                    };
                })
              }
              return done(err,user[0]);
          });
        // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        // return cb(null,profile);
      }
    ));

    //google
    
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            var newUser={
                id:profile.id,
                username:profile.displayName,
                email:profile.email,
                image:profile.photos[0].value,
            };
            console.log(newUser);
            connection.query("select * from userinfo.google where id = ?",[profile.id],function(err,user){
                if(err){
                    console.log(err);
                }else if(user.length==0){
                    conn.query("insert into userinfo.google (id,username,email,image) values (?, ?, ?, ?)",newUser,function(err,res){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(profile.id,profile.displayName);
                        };
                    })
                }
                return done(err,user[0]);
            })
            // try{
            //     var user=User.findOne({googleId:profile.id})

            //     if(user){
            //         done(null,user)
            //     }else{
            //         user=User.create(newUser)
            //         done(null,user)
            //     }
            // }catch(err){
            //     console.error(err)
            // }
            //use the profile info(mainly profile id) to check if the user is registered in ur db 
            return done(null,profile)
        }
    ));

};