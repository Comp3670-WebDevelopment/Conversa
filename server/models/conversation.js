var mongoose = require("mongoose");

var conversationSchema = mongoose.Schema({
    userIds: [
        mongoose.Schema.Types.ObjectId,
        mongoose.Schema.Types.ObjectId
    ],
    topic: mongoose.Schema.Types.ObjectId
});

var Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;