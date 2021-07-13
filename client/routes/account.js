const { readdirSync } = require("fs");

module.exports = function (app, passport) {

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
  };

  app.get('/account/login', function (req, res) {
    console.log('---------------------------');
    console.log(req);
    console.log('---------------------------');
    res.render('pages/account/login.ejs', { user: req.user, message: req.flash('signupMessage'), loginStatus: islogin });
  })

  app.post('/account/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
  }))

  app.post('/account/signup', passport.authenticate('local-signup', {
    successRedirect: '/account/login',
    failureRedirect: '/account/login#addmem',
    failureFlash: true
  }))


  // google login
  app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


  // app.get('/good',checkLoginStatus,(req,res)=>res.send(`you r ${req.user.displayName}`))
  app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
      console.log('login Successed');
      localStorage.setItem("username", req.user.displayName);
      console.log(req.user.displayName);
    });


  // facebook login
  app.get('/auth/facebook',
    passport.authenticate('facebook'));

  app.get('/auth/facebook/StuBeats',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });


  app.get('/logout', function (req, res) {
    req.session = null;
    req.logout();
    res.redirect('/');
  })

}