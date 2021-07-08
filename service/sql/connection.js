var mysql = require('mysql');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "2iuigigi",
    database: "report",
    charset: 'utf8mb4'
});

module.exports = con;