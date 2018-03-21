var mongoose = require('mongoose');
var Conversation = require('../models/conversation.js');
var Topic = require('../models/topic.js');
var User = require('../models/user.js');
var PendingConversation = require('../models/pending-conversation.js');

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

    // Home page
    app.get('/', function(req, res){

    });

    // Create a user
    app.post('/', function(req, res){

        var user = new User();

        user.save(function(err, data){
            if(err)
            {
                console.log(err);
                res.status(500).send({message: "An error occurred while creating the user."})
            }
            else
            {
                console.log("Created a user.");
                res.send(data);
            }
        });

    });

    // Create pending conversation
    app.get('/search-for-conversation/user/:userId/topic/:topicName', function(req, res){

        var userId = req.params.userId;
        var topicName = req.params.topicName;

        // Get all pending conversations
        // For loop for all pending conversations
        //      if topic is same as topicName
        //          remove pending conversation from collection
        //          create document for new conversation between these two users in the Conversation collection
        //          return something that tells the user that a conversation was found
        //          exit for loop
        //      if last iteration through loop
        //          add document to pending conversation collection
        //          return something that tells the user that no one else is searching for conversation about this topic

        //PendingConversation.find().exec(function(err, ))

    });

    // Get all topics, *users logged in data for graph*
    app.get('/chat-now', function(req, res){
        Topic.find().exec(function(err, topics){
            if (err) throw err;
            res.json({"topics": topics})
        })
    });

    // Create pending conversation
    app.post('/chat-now', function(req, res){

    });

    // Get all messages in conversation
    app.get('/chat-now/user/:userId/conversation/:conversationId', function(req, res){
        var conversationId = req.params.conversationId;

        Conversation.find({
            conversationId: conversationId
        }).exec(function(err, conversation){
            if (err) throw err;
            res.json({"conversation": conversation});
        })
    });

    // Get list of conversation for this user
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

};