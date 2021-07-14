var express = require('express');
var router = express.Router();


router.get('/editor', function(req, res, next) {
  res.render('pages/music/editor');
});

module.exports = router;
