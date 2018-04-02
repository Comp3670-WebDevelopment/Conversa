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

    // Get top 5 trending topics
    app.get('/get-trending-topics', function(req, res){

        Conversation.find().populate('topic').exec(function(err, conversations){

            var topicCounter = {};

            // Tally occurrence of each topic in an array
            for(var i = 0; i < conversations.length; i++)
            {
                var topic = conversations[i].topic.name;
                topicCounter[topic] = (topicCounter[topic] || 0) + 1
            }

            // Sort array by topics with most conversations. Only return 5
            var topicArr = [];
            for(var topicName in topicCounter)
            {
                topicArr.push([topicName, topicCounter[topicName]]);
            }
            topicArr.sort(function(a, b){
                return b[1] - a[1];
            });
            topicArr = topicArr.slice(0, 4);

            res.json({"trending_topics" : topicArr});
        });
    });

    // Get 5 previous topics
    app.get('/get-previous-topics/user/:userId', function(req, res){
        var userId = req.params.userId;

        Conversation.find({
            userIds: userId
        }).populate('topic').sort({created_at: "descending"}).limit(5).exec(function(err, topics){
            res.json({"previous_topics" : topics});
        });
    });

    // Get all topics
    app.get('/get-topics', function(req, res){
        Topic.find().sort({name: 'ascending'}).exec(function(err, topics){
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

    app.get('/chat-now/conversation/:conversationId', function(req, res){
        var conversationId = req.params.conversationId;

        Conversation.find({
            _id: conversationId
        }).populate('topic').exec(function(err, conversation){
            if(err) throw err;
            res.json({"conversation": conversation})
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
        }).sort({createdAt: "descending"}).exec(function(err, conversations){
            if (err) throw err;
            res.json({"users_conversations": conversations});
        });
    });

    app.post('/chat-now/remove-conversation/conversation/:conversationId', function(req, res){
        var conversationId = req.params.conversationId;

        removeConversation(conversationId);
        removeMessages(conversationId);

        res.json({"result": "Finished removing conversation and messages."})

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

    function removeConversation(id)
    {
        Conversation.remove({_id: id}).exec(function(err, result){
            if (err) throw err;
            console.log("Removed conversation.");
        });
    }

    function removeMessages(conversationId)
    {
        Message.remove({conversationId: conversationId}).exec(function(err, result){
            if (err) throw err;
            console.log("Removed messages.");
        })
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
