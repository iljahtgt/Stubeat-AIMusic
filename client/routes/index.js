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

/* GET home page. */
router.get('/', function(req, res, next) {
  checkloginStatus(req,res);
  res.render('pages/main/index',{user:req.user,loginStatus:islogin});
  
});

router.get('/about', function(req, res, next) {
  checkloginStatus(req,res);
  res.render('pages/main/about',{user:req.user,loginStatus:islogin});
  
});


module.exports = router;
