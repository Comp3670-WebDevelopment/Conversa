var mongoose = require("mongoose");

var topicSchema = mongoose.Schema({
    name: String
});

var Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;