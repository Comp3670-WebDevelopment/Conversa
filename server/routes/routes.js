var mongoose = require('mongoose');
var User = require('../models/user.js');
var PendingConversation = require('../models/pending_conversation.js');
var Conversation = require('../models/conversation.js');
var Message = require('../models/message.js');
var Topic = require('../models/topic.js');

module.exports = function(app)
{
    // Get trending topics for frontend widget
    /*app.get('*', function(req, res){

        Conversation.find().exec(function(err, conversations){
            if (err) throw err;

            var trendingTopics = [10];
            //Process conversations to return number of conversations for top 10 topics
            res.send("");
            //res.json({"trending_topics": trendingTopics});
        });

    });*/

    // Create topic
    app.post('/create-topics', function(req, res){
        createTopic(res,"");
    });

    // Home page
    app.get('/', function(req, res){

    });

    // Create a user
    app.post('/create-user', function(req, res){

        createUser(res);

    });

    // Search for conversation
    app.get('/search-for-conversation/user/:userId/topic/:topicName', function(req, res){

        var userId = req.params.userId;
        var topicName = req.params.topicName;

        PendingConversation.find().sort({date: 'ascending'}).exec(function(err, pendingConversations){

            if(pendingConversations.length == 0)
            {
                createPendingConversation(res, userId, topicName);
            }
            else
            {
                for(var i = 0; i < pendingConversations.length; i++)
                {
                    // Found two people looking for conversation about same topic
                    if(pendingConversations[i].topic == topicName)
                    {
                        removePendingConversation(pendingConversations[i]._id);
                        createConversation(res, userId, pendingConversations[i].userId, topicName);

                        break;
                    }

                    // True when no pending conversation has same topic
                    if(i == pendingConversations.length - 1)
                    {
                        createPendingConversation(res, userId, topicName);
                    }
                }
            }

        });

    });

    // Get all topics, *users logged in data for graph*
    app.get('/get-topics', function(req, res){
        // Get top five topics based on num of conversations with that topic
        Conversation.find().exec(function(err, conversations){

        });
    });

    // Create a pending conversation
    app.post('/chat-now', function(req, res){

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

    // Get list of conversations for this user
    app.get('/history/user/:userId', function(req, res){
        var userId = req.params.userId;

        Conversation.find({
            userId: userId
        }).exec(function(err, conversations){
            if (err) throw err;
            res.json({"users_conversations": conversations});
        });

    });

    // About Us page
    app.get('/about-us', function(req, res){

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
            topic: topic
        });

        conversation.save(function(err){
            logErrors(res, err, data, "conversation")
        });
    }

    function createPendingConversation(res, userId, topic)
    {
        var pendingConversation = new PendingConversation({
            topic: topic,
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
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("Created a topic.");
            }
        });
    }

    function removePendingConversation(id)
    {
        PendingConversation.find({_id: id}).remove(function(err){
            if(err) throw err;
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
            res.send(data);
        }
    }
};