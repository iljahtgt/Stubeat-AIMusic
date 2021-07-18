var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "chris17",
    port: 3306,
    database: "stuBeat",
});

module.exports = connection;