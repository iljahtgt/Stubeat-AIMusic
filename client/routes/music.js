var express = require('express');
var router = express.Router();

var islogin=false;
  var checkloginStatus=function(req,res){
    islogin=false;
    if(req.isAuthenticated()){
      islogin=true;
    };
  };
  var loggedin=(req,res,next)=>{
    if(req.user){
      next();
    }else{
      res.sendStatus(401);
    }
  }

router.get('/editor', function(req, res, next) {
  res.render('pages/music/editor', {user:req.user,loginStatus:islogin});
});

module.exports = router;
