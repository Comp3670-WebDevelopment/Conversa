(function(){

    $(document).ready(function(){

        //localStorage.setItem("userId", "");
        checkUserId();
        setTabClickEvents();
        showHomeScreen();

    });

    /*
        This function checks if the user has logged in before by checking the browser for a userId stored in
        localStorage. If they haven't, we create a new user in the database and store that id in localStorage.
     */
    function checkUserId()
    {
        if(localStorage.getItem("userId"))
        {
            console.log("User has logged in before.");
        }
        else
        {
            var userId;
            $.post("/create-user", {}, function(result){
                    userId = result["created_document"]._id;
                    localStorage.setItem("userId", userId);
                }
            );
        }
    }

    // Handles the appending and removal of html widgets upon clicking a tab
    function setTabClickEvents()
    {
        $("#nav-chat").on("click", function(e){

            removeUnderlines();
            $(this).css("text-decoration", "underline");

            removeMiddleWidgets();
            addChatNowWidgetContainers();
            addChatNowWidgets();
            addChatNowEvents();
        });

        $("#nav-history").on("click", function(e){

            removeUnderlines();
            $(this).css("text-decoration", "underline");

            removeMiddleWidgets();
            addHistoryWidgetContainers();
            addHistoryWidgets();
        });

        $("#nav-about-us").on("click", function(e){

            removeUnderlines();
            $(this).css("text-decoration", "underline");

            removeMiddleWidgets();
            addAboutUsWidgetContainers();
            addAboutUsWidgets();
        });
    }

    function removeUnderlines()
    {
        $("#nav-chat").css("text-decoration", "initial");
        $("#nav-history").css("text-decoration", "initial");
        $("#nav-about-us").css("text-decoration", "initial");
    }

    function showHomeScreen()
    {
        $("#nav-chat").trigger("click");
    }

    function removeMiddleWidgets()
    {
        $("#content").unbind();
        $("#content").empty();
    }

    function addChatNowWidgetContainers()
    {
        var row = $("<div class='row'></div>");
        var left = $("<div class='left col l4 m4 s12'></div>");
        var right = $("<div class='right col l8 m8 s12'></div>");
        left.append($('<article id="trending-topics"></article>'));
        right.append($('<article id="choose-your-topic"></article>'));
        right.append($('<article id="usage-stats"></article>'));
        $("#content").append(left);
        $("#content").append(right);
    }

    function addHistoryWidgetContainers()
    {
        var row = $("<div class='row'></div>");
        row.append($("<article id='trending-topics' class='col l4 m4 s12'></article>"));
        row.append($("<article id='previous-conversations' class='col l4 m4 s12'></article>"));
        row.append($("<article id='previous-topics' class='col l4 m4 s12'></article>"));
        $("#content").append(row);
    }


    function addAboutUsWidgetContainers()
    {
        $("#content").append($('<article id="trending-topics"></article>'));
        $("#content").append($('<article id="about-us"></article>'));
    }

    function addChatNowWidgets()
    {
        addTrendingTopicsWidget();
        $.get("/widgets/topic-chooser.html", function(data){
            $("#choose-your-topic").html(data);
            populateTopicChooserWidget();
        });
        $.get("/widgets/usage-stats.html", function(data){
            $("#usage-stats").html(data);
            createChart();
        });
    }

    function populateTopicChooserWidget()
    {
        $.get("/get-topics", {}, function(results){

            for(var i = 0; i < results["all_topics"].length; i++)
            {
                var selectElem = $("#topic-selector");
                selectElem.append("<option>" + results["all_topics"][i].name + "</option>")
            }

        });
    }

    function addHistoryWidgets()
    {
        addTrendingTopicsWidget();
        $.get("/widgets/previous-conversations.html", function(data){
            $("#previous-conversations").html(data);
            populatePreviousConversationsWidget();
        });
        $.get("/widgets/previous-topics.html", function(data){
            $("#previous-topics").html(data);
            populatePreviousTopicsWidget();
        });
    }

    function populatePreviousConversationsWidget()
    {
        var url = '/get-conversations/user/' + localStorage.getItem('userId');
        $.get(url, {}, function(results){

            for(var i = 0; i < results["users_conversations"].length; i++)
            {
                var conversationId = results["users_conversations"][i]._id;
                var conversationItemElem = $("<div class='conversation-item' data-conversationid='" + conversationId + "'></div>");
                var conversationDateElem = $("<div class='conversation-date'>Conversation On 3/3/18</div>");
                var conversationMessageCountElem = $("<div class='conversation-messages'>13 Messages</div>");

                $("#conversation-item-holder").append(conversationItemElem);
                conversationItemElem.append(conversationDateElem);
                conversationItemElem.append(conversationMessageCountElem);
            }

            addPreviousConversationWidgetEvents();
        });
    }

    function addPreviousConversationWidgetEvents()
    {
        $(".conversation-item").one("click", function(e){

            var conversationId = this.dataset.conversationid;
            removeMiddleWidgets();
            showConversationScreen(conversationId);

        });
    }

    function populatePreviousTopicsWidget()
    {
        var url = "/get-previous-topics/user/" + localStorage.getItem("userId");
        $.get(url, {}, function(results){

            for(var i = 0; i < results["previous_topics"].length; i++)
            {
                var topic = results["previous_topics"][i].topic.name;

                // Create topic items and append here
                var topicItemElem = $("<div class='previous-topic-item'></div>");
                var topicConversationDateElem = $("<div class='previous-topic-date'>Started Conversation on 1/1/18</div>");
                var topicNameElem = $("<div class='previous-topic'>" + topic + "</div>");

                $("#topic-item-holder").append(topicItemElem);
                topicItemElem.append(topicConversationDateElem);
                topicItemElem.append(topicNameElem)
            }

        });
    }

    function addAboutUsWidgets()
    {
        addTrendingTopicsWidget();
        $.get("/widgets/about-us.html", function(data){
            $("#about-us").html(data);
        });
    }

    function addTrendingTopicsWidget()
    {
        $.get("/widgets/trending-topics.html", function(data){
            $("#trending-topics").html(data);
            populateTrendingTopicsWidget();
        });
    }

    function populateTrendingTopicsWidget()
    {
        $.get("/get-trending-topics", {}, function(results){

            for(var i = 0; i < results["trending_topics"].length; i++)
            {
                var trendingTopicElem = $("<div class='trending-topic-item'></div>");
                var trendingTopicTitle = $("<div class='title'>" + results["trending_topics"][i][0] + "</div>");
                var trendingTopicConversations = $("<div class='conversations'>" + results["trending_topics"][i][1] + " Conversations</div>")

                $("#trending-topic-item-holder").append(trendingTopicElem);
                trendingTopicElem.append(trendingTopicTitle);
                trendingTopicElem.append(trendingTopicConversations);
            }
        });
    }

    function addChatNowEvents()
    {
        $("#content").one('click', '#find-conversation', function(e){

            if($("#topic-selector").find(":selected:enabled").length == 0)
            {
                alert("You must select a topic to chat about!");
                e.preventDefault();
            }
            else
            {
                var userId = localStorage.getItem("userId");
                var topicName = $("#topic-selector").find(":selected:enabled")[0].innerText;
                var url = '/search-for-conversation/user/' + userId + '/topic/' + topicName;

                // Get request to search for a conversation
                // If found conversation, render messaging widget. Otherwise render no conversations found widget
                $.get(url, {}, function(result){

                    var userIds = result["created_document"].userIds;

                    // Looks at userIds field to determine if it is a conversation or pending conversation
                    if(userIds)
                    {
                        // Launch conversation screen
                        removeMiddleWidgets();
                        showConversationScreen(result["created_document"]._id);
                    }
                    else
                    {
                        // Launch waiting for another user screen
                        console.log("Pending conversation.");
                    }
                });
            }

        });

    }

    function showConversationScreen(conversationId)
    {
        var row = $("<div class='row'></div>");
        row.append($("<article id='trending-topics' class='col l3 m3 s12'></article>"));
        row.append($("<article id='conversation-screen' class='col l9 m9 s12'></article>"));
        $("#content").append(row);

        addTrendingTopicsWidget();
        $.get("/widgets/conversation.html", function(data){
            $("#conversation-screen").html(data);
            populateConversationScreen(conversationId);
            addConversationEvents(conversationId);
        });
    }

    function populateConversationScreen(conversationId)
    {
        var url = "/chat-now/user/" + localStorage.getItem("userId") + "/conversation/" + conversationId;

        $.get("/chat-now/conversation/" + conversationId, {}, function(result){

            $($("#conversation-title")[0]).text(result["conversation"][0].topic.name);

        });

        $.get(url, {}, function(results){

            if(results["messages"].length > 0)
            {
                var messageCont = $("#message-cont");

                for(var i = 0; i < results["messages"].length; i++)
                {
                    var newMessage = $("<div class='message'>" + results["messages"][i].text + "</div>");
                    if(results["messages"][i].author == localStorage.getItem("userId"))
                    {
                        newMessage.css("float", "right");
                    }
                    messageCont.append(newMessage);
                }
            }

        });
    }

    function addConversationEvents(conversationId)
    {
        $("#send-button").ready(function(){

            $("#send-button").on("click", function(e) {
                var messageToSend = $("#message-to-send").val();
                var url = "/chat-now/user/" + localStorage.getItem("userId") + "/conversation/" + conversationId +
                    "/message/" + messageToSend;

                $.post(url, {}, function(results){});

                $("#message-to-send").val("");
                var messageCont = $("#message-cont");
                var newMessage = $("<div class='message'>" + messageToSend + "</div>");
                newMessage.css("float", "right");
                messageCont.append(newMessage);

            });

        });

        $("#leave-conversation").on("click", function(e){

            $.post("/chat-now/remove-conversation/conversation/" + conversationId, {}, function(results){
                showHomeScreen();
            });

        });

        $("#back-to-main").one("click", function(e){
            showHomeScreen();
        });
    }
	
	function createChart()
	{
		var dps = []; //data points 

        //Variable for chart creation and property definitions
        var chart = new CanvasJS.Chart("chartContainer", {
            title:{
                text: "Usage Statistics"
            },

            axisX:{
                title: "Time",
                valueFormatString: "MMMM D HH:mm:ss"  //use TT for AM/PM
                //labelAngle: 0
            },
            axisY: {
                title: "Active Users",
                includeZero: false
            },
            data: [{
                type: "line",
                xValueType: "dateTime",
                //xValueFormatString: "MMMM:D:YYYY TT",
                dataPoints: dps
            }]
        });


        //Variables for updating the chart
        var updateInterval = 2; //ticker for updating the graph (in seconds)
        var updateIntervalinMS = updateInterval * 1000; //ticker for updating the graph (in milli-seconds)

        var dataLength = 5; //max number of data points visible on the graph at once

        //var initialNumOfPoints = 2; //number of visible data points when you first load the page
        //var numActiveUsers = 100;

        //Variable keeping track of time
        var time = new Date;
        time.getMonth();
        time.getDay();
        time.getHours();
        time.getMinutes();
        time.getSeconds();


        //Function that updates the chart
        var updateChart = function(count) {

            count = count || 1;

            //As time goes on, randomize the number of active users (numActiveUsers)
            for (var i = 0; i < count; i++)
            {
                time.setTime(time.getTime() + updateIntervalinMS);
                numActiveUsers = Math.ceil(getRandomNum(1, 100000));


                //New values are added to the end of the x & y arrays
                dps.push({
                    x: time.getTime(),
                    y: numActiveUsers
                });
            }

            /*
            Shifts data points from right to left
            If necessary, a data point disappears from the chart
            in order to ensure that only a certain number of data points
            are on the chart at any given time
            */
            if (dps.length > dataLength) {
                dps.shift();
            }

            chart.render();
        };

        /*
            -calls the UpdateChart function

            -If no parameter is given, chart is initialized with one data point
            -Inserting a parameter will initialize the chart to have the number of data points
            as specified by the parameter value
        */
        updateChart();

        setInterval
        (
            function()
            {
                updateChart()
            },

            updateIntervalinMS
        );

        //Function that generates a random number
        function getRandomNum(min, max) {
          return Math.random() * (max - min) + min;
        }

	}

})();
