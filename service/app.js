var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var sqlService = require("./api/sqlService.js");


var port = process.env.PORT || 1337;

var cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

//=====================================

app.use("/api", sqlService);

//=====================================



app.listen(port);
console.log(`Server is listening on port ${port}`);