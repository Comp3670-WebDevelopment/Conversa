var mongoose = require("mongoose");

var userSchema = mongoose.Schema({});

var User = mongoose.model("User", userSchema);

module.exports = User;