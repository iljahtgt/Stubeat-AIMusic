var express = require('express');
var router = express.Router();
var con = require('../config/connection.js');


// not done
// router.get('/list', function (req, res) {
//     var sql = 'SELECT * FROM userdata';

//     con.query(sql, data, function (err, result) {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         res.send(result);

// });
// });

module.exports = router;