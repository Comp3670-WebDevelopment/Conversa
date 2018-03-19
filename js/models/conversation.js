var mongoose = require("mongoose");

var conversationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userIds: [
        mongoose.Schema.Types.ObjectId,
        mongoose.Schema.Types.ObjectId
    ],
    topic: String
});

var Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;