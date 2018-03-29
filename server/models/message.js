var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;