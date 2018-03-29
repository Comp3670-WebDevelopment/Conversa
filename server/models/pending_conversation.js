var mongoose = require("mongoose");

var pendingConversationSchema = mongoose.Schema({
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var PendingConversation = mongoose.model("Pending Conversation", pendingConversationSchema);

module.exports = PendingConversation;