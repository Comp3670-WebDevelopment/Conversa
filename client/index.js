(function(){

    $(document).ready(function(){

        checkUserId();
        setTabClickEvents();
        addChatNowEvents();

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
            $.post("/", {}, function(result){
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
        });

        $("#nav-history").on("click", function(e){

            removeUnderlines();
            $(this).css("text-decoration", "underline");

            removeMiddleWidgets();
            addHistoryWidgetContainers();
            addHistoryWidgets();
            addHistoryEvents();
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
        $("#content").append($('<article id="trending-topics"></article>'));
        $("#content").append($('<article id="choose-your-topic"></article>'));
        $("#content").append($('<article id="usage-stats"></article>'));
    }

    function addHistoryWidgetContainers()
    {
        var row = $("<div class='row'></div>")
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
                var topicName = $("#topic-selector").find(":selected:enabled")[0].innerText.toLowerCase();
                var url = '/search-for-conversation/user/' + userId + '/topic/' + topicName;

                // Get request to search for a conversation
                // If found conversation, render messaging widget. Otherwise render no conversations found widget
                $.get(url, {}, function(result){

                });
            }

        });

    }

    function addHistoryEvents()
    {
      var url = '/get-conversations/user/' + localStorage.getItem('userId');
      $.get(url, {}, function(result){

      });
    }

})();
