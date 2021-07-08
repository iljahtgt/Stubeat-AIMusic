var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var sqlService = require("./api/sqlService.js");


var port = process.env.PORT || 1337;

var app = express();

// turn the data from request into json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());


//=====================================

app.use("/api", sqlService);
// app.use("/auth", OAuth);

//=====================================



app.listen(port);
console.log(`Server is listening on port ${port}`);