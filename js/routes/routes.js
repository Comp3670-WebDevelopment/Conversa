var mongoose = require('mongoose');
var Conversation = require('../models/conversation.js');
var Topic = require('../models/topic.js');
var User = require('../models/user.js');

module.exports = function(app)
{
    app.get('*', function(req, res){

        /*
        Conversation.find().exec(function(err, conversations){
            if (err) throw err;

            var trendingTopics = [10];
            //Process conversations to return number of conversations for top 10 topics

            //res.json({"trending_topics": trendingTopics});
        });
        */
        res.send("");

    });

    app.get('/', function(req, res){
        // Determine if there is already a userId in localStorage
        /*
        User.find({
            _id: req.params.userId
        }).exec(function(err, user){

        });
        */
        // If there isn't create a new user, return _id
    });

    app.get('/chat-now', function(req, res){
        Topic.find().exec(function(err, topics){
            if (err) throw err;
            res.json({"topics": topics})
        })
    });

    app.get('/chat-now/user/:userId/conversation/:conversationId', function(req, res){
        var conversationId = req.params.conversationId;

        Conversation.find({
            conversationId: conversationId
        }).exec(function(err, conversation){
            if (err) throw err;
            res.json({"conversation": conversation});
        })
    });

    app.get('/history/user/:userId', function(req, res){
        var userId = req.params.userId;

        Conversation.find({
            userId: userId
        }).exec(function(err, conversations){
            if (err) throw err;
            res.json({"users_conversations": conversations});
        });

    });

    app.get('/about-us', function(req, res){

    });

};