(function(){

    $(document).ready(function(){

        checkUserId();

    });

    function checkUserId()
    {
        var req = new XMLHttpRequest();
        //req.open("GET", "/");

        if(localStorage.getItem("userId"))
        {

        }
        else
        {
            // Create xmlhttprequest to create a new user, return userId and set it in localStorage
        }

    }

})();