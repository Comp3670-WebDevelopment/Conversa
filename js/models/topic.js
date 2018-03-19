var mongoose = require("mongoose");

var topicSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
});

var Topic = mongoose.model("Message", topicSchema);

module.exports = Topic;