var mongoose = require("mongoose");

var conversationSchema = mongoose.Schema({
    userIds: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
});

var Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;