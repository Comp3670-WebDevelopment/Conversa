var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    conversationId: mongoose.Schema.Types.ObjectId,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;