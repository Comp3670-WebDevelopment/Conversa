(function(){

    $(document).ready(function(){

        checkUserId();
        setTabClickEvents();
        // Renders Home Screen
        $("#nav-chat").trigger("click");

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
                    userId = result._id;
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

    function removeMiddleWidgets()
    {
        $("#content").empty();
    }

    function addChatNowWidgetContainers()
    {
        var row = $("<div class='row'></div>");
        var left = $("<div class='col l3 m3 s12'></div>");
        var right = $("<div class='col l9 m9 s12'></div>");
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
        });
        $.get("/widgets/usage-stats.html", function(data){
            $("#usage-stats").html(data);
            createChart();
        });
    }

    function addHistoryWidgets()
    {
        addTrendingTopicsWidget();
        $.get("/widgets/previous-conversations.html", function(data){
            $("#previous-conversations").html(data);
        });
        $.get("/widgets/previous-topics.html", function(data){
            $("#previous-topics").html(data);
        });

        // Make http requests and Populate widgets
        var url = '/get-conversations/user/' + localStorage.getItem('userId');
        $.get(url, {}, function(result){

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

            //request all topics here
            $.get("/get-topics", {}, function(result){

            });

            $("#trending-topics").html(data);
        });
    }

    function addChatNowEvents()
    {
        $("#content").on('click', '#find-conversation', function(e){

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
                    }
                    else
                    {
                        // Launch waiting for another user screen
                    }
                });
            }

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
