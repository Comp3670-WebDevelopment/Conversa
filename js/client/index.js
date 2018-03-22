(function(){

    $(document).ready(function(){

        checkUserId();
		createChart();

    });
	
	
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
					valueFormatString: "MMMM D HH:mm:ss",  //use TT for AM/PM
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