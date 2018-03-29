var mongoose = require('mongoose');
var User = require('../models/user.js');
var PendingConversation = require('../models/pending_conversation.js');
var Conversation = require('../models/conversation.js');
var Message = require('../models/message.js');
var Topic = require('../models/topic.js');

module.exports = function(app)
{
    // Home page
    app.get('/', function(req, res){});

    // Create topic
    app.post('/create-topics', function(req, res){
        createTopic(res, "");
    });

    // Create a user
    app.post('/create-user', function(req, res){
        createUser(res);
    });

    // Search for conversation
    app.get('/search-for-conversation/user/:userId/topic/:topicName', function(req, res){

        var userId = req.params.userId;
        var topicName = req.params.topicName;

        Topic.find({
            name: topicName
        }).exec(function(err, topic){
            if (err) throw err;
            else {
                topic = topic[0];

                PendingConversation.find().populate('topic').sort({date: 'ascending'}).exec(function(err, pendingConversations){

                    if(pendingConversations.length == 0)
                    {
                        createPendingConversation(res, userId, topic);
                    }
                    else
                    {
                        for(var i = 0; i < pendingConversations.length; i++)
                        {
                            // Found two people looking for conversation about same topic
                            if(pendingConversations[i].topic.id == topic.id)
                            {
                                removePendingConversation(pendingConversations[i].id);
                                createConversation(res, userId, pendingConversations[i].userId, topic);

                                break;
                            }

                            // True when no pending conversation has same topic
                            if(i == (pendingConversations.length - 1))
                            {
                                createPendingConversation(res, userId, topic);
                            }
                        }
                    }

                });
            }
        });

    });

    // Get all topics, *users logged in data for graph*
    app.get('/get-topics', function(req, res){
        // Get top five topics based on num of conversations with that topic
        Conversation.find().exec(function(err, topics){
            res.json({"all_topics" : topics});
        });
    });

    // Get all messages in conversation
    app.get('/chat-now/user/:userId/conversation/:conversationId', function(req, res){
        var conversationId = req.params.conversationId;

        Message.find({
            conversationId: conversationId
        }).exec(function(err, messages){
            if (err) throw err;
            res.json({"messages": messages})
        })
    });

    // Create a message
    app.post('/chat-now/user/:userId/conversation/:conversationId/message/:text', function(req, res){
        var userId = req.params.userId;
        var conversationId = req.params.conversationId;
        var messageText = req.params.text;

        createMessage(res, conversationId, userId, messageText);
    });

    //Get all conversations based on userId
    app.get('/get-conversations/user/:userId', function(req, res){
        var userId = req.params.userId;

        Conversation.find({
            userIds: userId
        }).exec(function(err, conversations){
            if (err) throw err;
            res.json({"users_conversations": conversations});
        });
    });

    function createUser(res)
    {
        var user = new User();

        user.save(function(err, data){
            logErrors(res, err, data, "user");
        });
    }

    function createConversation(res, userId1, userId2, topic)
    {
        var conversation = new Conversation({
            userIds: [
                userId1,
                userId2
            ],
            topic: topic.id
        });

        conversation.save(function(err, data){
            logErrors(res, err, data, "conversation")
        });
    }

    function createPendingConversation(res, userId, topic)
    {
        var pendingConversation = new PendingConversation({
            topic: topic.id,
            userId: userId
        });

        pendingConversation.save(function(err, data){
            logErrors(res, err, data, "pending conversation");
        });
    }

    function createMessage(res, conversationId, author, text)
    {
        var message = new Message({
            conversationId: conversationId,
            author: author,
            text: text
        });

        message.save(function(err, data){
            logErrors(res, err, data, "message");
        });
    }

    function createTopic(res, name)
    {
        var topic = new Topic({
            name: name
        });

        topic.save(function(err, data){
            logErrors(res, err, data, "topic")
        });
    }

    function removePendingConversation(id)
    {
        PendingConversation.remove({_id: id}).exec(function(err, result){
            if (err) throw err;
            console.log("Removed pending conversation.");
        });
    }

    function logErrors(res, err, data, model)
    {
        if(err)
        {
            console.log(err);
            res.status(500).send({message: "An error occurred while creating a " + model + "."})
        }
        else
        {
            console.log("Created a " + model + ".");
            res.json({"created_document" : data});
        }
    }
};
