var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "chris17",
    port: 3306,
    database: "userinfo",
});

module.exports = con;