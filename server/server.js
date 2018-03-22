global.__basedir = process.cwd();

var express = require("express");
var bodyParser = require("body-parser");

// Application configuration
var app = express();

app.use(express.static(__basedir + '/client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});

// Handles all routes
require("./routes/routes.js")(app);

// Database Configuration
var dbConfig = require("./config/database-config.js");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function(){
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
});

mongoose.connection.once('open', function(){
    console.log("Successfully connected to the database.");
});
