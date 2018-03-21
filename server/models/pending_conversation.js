var mongoose = require("mongoose");

var pendingConversationSchema = mongoose.Schema({
    topic: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var PendingConversation = mongoose.model("Pending Conversation", pendingConversationSchema);

module.exports = PendingConversation;