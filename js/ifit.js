var treadmill = "10.0.1.6";
var test      = false;
var websocket;

function scroller(){
   var console = $('#ConsoleText');
   console.scrollTop(
       console[0].scrollHeight - console.height()
   );
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


$(function() {

    var csvOut = "";

    $('#ConsoleText').append("iFit Treadmill Websockets Command (version 1.2_js)\n");
    $('#ConsoleText').append("jquery, ds3, sprintf\n\n");
    $('#ConsoleText').append("Initializing...\n\n");
    $('#ConsoleText').append("\n\nInstructions\n-----------------------------------------------\n");
    $('#ConsoleText').append("Use 'Connect' to be able to send commands.\n\nSliders will send active parameters on release.\n");
    $('#ConsoleText').append("\nUse 'Disconnect' to close websocket communication.\n\n");

    $('#connect').click(connect);
    $('#disconnect').click(disconnect);

    // Construct the sliders

    $(".slider-container").iFitSlider();

    // Responds to mouse drags on slider and updates screen

    $(".iFitSlider").on('input',function() {
      $(this).next(".ifitlabel").text(this.value);
    });

    // Responds to mouse up on slider and fires events to web socket if open

    $(".iFitSlider").change(function() {

      parent     = $(this).parents()[0];                       // Get the parent element to the slider
      parentdata = $(parent).data('slider');                   // Get the data from the parent element

      message    = sprintf(parentdata.message,this.value) + "\n";     // Format the message to send to the web socket

      //$('#ConsoleText').append("MESSAGE " + message + "\n");
      //$('#ConsoleText').append("SETTING " + parentdata.stub + " to " + this.value + "\n"); scroller();
	scroller();
	if (websocket) {
            if(websocket.readyState === websocket.OPEN){
	     doSend(message);
            }
	} else {
	    $("#ConsoleText").append("Not connected - won't send\n");
	    scroller();
        }

    });

  
  function connect(ele) {
    websocket = new WebSocket( "ws://" + treadmill + "/control" );

    websocket.onopen = function (evt) {
      onOpen(evt)
    };

    websocket.onclose = function (evt) {
      onClose(evt)
    };

    websocket.onmessage = function (evt) {
      onMessage(evt)
    }; 

    websocket.onerror = function (evt) {
      onError(evt)
    };

    $(".iFitSlider").trigger("change");
  }

  function disconnect() {
    websocket.close();
      websocket = undefined;
  }

  function onOpen(evt) {
    $('#ConsoleText').append("CONNECTED\n");
    $('#ConsoleText').append("--------------------------------------------\n");
    $('#ConsoleText').append("Initial Machine Parameters\n");
    $('#ConsoleText').append("--------------------------------------------\n\n");
    scroller();
  }

  function onClose(evt) {
    $('#ConsoleText').append("\n--------------------------------------------\n");
    $('#ConsoleText').append("\"YOUR DEVICE IS DISCONNECT :-)\"\n");
    $('#ConsoleText').append("--------------------------------------------\n");

    $('#ConsoleText').append(csvOut);

    scroller();
  }


// Start file download.
document.getElementById("dwn-btn").addEventListener("click", function(){
    // Generate download of csv.txt file with some content

var currentdate = new Date().toLocaleString(); 


    var filename = "iFitRunData_" + currentdate + ".csv";
    download(filename, csvOut);
}, false);


  var counter = 0;
  var lastsecond = 0;

  var mph = 0;
  var incline = 0;
  var heart = 0;
  var outmessage = "";


var speedinclineChartData = [
                    {label: "mph", values: []},
                    {label: "incline", values: []},
                ];

var heartChartData = [ {label: "heart", values: []} ];


var speedinclineChartInstance = $('#myspeedinclineChart').epoch({
		type: 'time.line',
		historySize: 200,
		range: [-3,12],
 	        ticks: { time: 100, right: 5, left: 10 },
		windowSize: 200,
		axes: ['left', 'bottom'],
		data: speedinclineChartData });

var heartChartInstance = $('#myheartChart').epoch({
                type: 'time.line',
                historySize: 200,
		range: [60,200],
                ticks: { time: 100, right: 5, left: 10 },
                windowSize: 200,
                axes: ['left', 'bottom'],
                data: heartChartData });

          speedinclineChartInstance.redraw();
          heartChartInstance.redraw();


var lastseconds = 0;
var timehash = {};

function onMessage(evt) {

// GRAPH  test data
/* heart=Math.floor(Math.random()*200); 
mph=Math.floor(Math.random()*10); 
incline=Math.floor(Math.random()*10); 
var d = new Date();
var seconds = Math.round(d.getTime()/1000);
    speedinclineChartData[0].values.push({time: seconds, y: mph});
    speedinclineChartData[1].values.push({time: seconds, y: incline});
    heartChartData[0].values.push({time: seconds, y: heart});
                
    speedinclineChartInstance.push ([
         {time: seconds, y: mph},
         {time: seconds, y: incline},
    ]);

    heartChartInstance.push ([
          {time: seconds, y: heart}
    ]);
*/
// GRAPH test

      // first packet is magic - store it, don't update graph
      if (counter == 0) {
          var parsed = JSON.parse(evt.data, (key, value) => {
              if (key != "values" && key != ""){
                  $('#ConsoleText').append(sprintf("%-28s %s\n", key, value));
              }
              scroller();
          });
          counter++;
          $('#ConsoleText').append("\n--------------------------------------------\n\n");
          $('#ConsoleText').append("\nTime, MPH, Incline, Heartrate, Event\n");
          csvOut = ("Time, MPH, Incline, Heartrate, Event\n");
          scroller();

      } else {

//new data.
	
          if (evt.data != '{ }') {
              var d = new Date();
              var seconds = Math.round(d.getTime());

	      var donethis=0;
	      var thisevent = "";

              var parsed = JSON.parse(evt.data, (key, value) => {

              // is not key press data or workout type...  
              if (!(seconds in timehash)) {
              
	        if (key == "Chest Pulse"){ 
		     if (value != 0){
			heart = value;
                        heartChartData[0].values.push({time: seconds, y: heart});
			speedinclineChartData[0].values.push({time: seconds, y: mph});
                        speedinclineChartData[1].values.push({time: seconds, y: incline});
		        thisevent = "Chest";	
		
                        heartChartInstance.push ([ 
                                {time: (seconds/1000), y: heart}
                        ]);
                        speedinclineChartInstance.push ([
                                {time: (seconds/1000), y: mph},
                                {time: (seconds/1000), y: incline}
                        ]);

                        $('#ConsoleText').append(outmessage = sprintf("\"%s\", %s, %s, %s, %s\n", Date(seconds*1000), thisevent, mph, incline, heart ));
                        csvOut = csvOut + sprintf("\"%s\", %s, %s, %s, %s\n", Date(seconds), mph, incline, heart,thisevent );
		      }
	         };


                      if (key == "MPH"){ 
			mph = value;
			heartChartData[0].values.push({time: seconds, y: heart});
                        speedinclineChartData[0].values.push({time: seconds, y: mph});
                        speedinclineChartData[1].values.push({time: seconds, y: incline});
			thisevent = "MPH";

                        heartChartInstance.push ([ 
                                {time: (seconds/1000), y: heart}
                        ]);
	                speedinclineChartInstance.push ([
                                {time: (seconds/1000), y: mph},
                                {time: (seconds/1000), y: incline}
                        ]);
	                $('#ConsoleText').append(outmessage = sprintf("\"%s\", %s, %s, %s, %s\n", Date(seconds*1000), thisevent, mph, incline, heart ));
                        csvOut = csvOut + sprintf("\"%s\", %s, %s, %s, %s\n", Date(seconds), mph, incline, heart,thisevent );
		      };


                       if (key == "Actual Incline"){ 
			incline = value;
			heartChartData[0].values.push({time: seconds, y: heart});
                        speedinclineChartData[0].values.push({time: seconds, y: mph});
                        speedinclineChartData[1].values.push({time: seconds, y: incline});
			thisevent = "Incline";

		        heartChartInstance.push ([ 
                                {time: (seconds/1000), y: heart}
                        ]);

			speedinclineChartInstance.push ([
                                {time: (seconds/1000), y: mph},
                                {time: (seconds/1000), y: incline}
                        ]);
                        $('#ConsoleText').append(outmessage = sprintf("\"%s\", %s, %s, %s, %s\n", Date(seconds*1000), thisevent, mph, incline, heart ));
                        csvOut = csvOut + sprintf("\"%s\", %s, %s, %s, %s\n", Date(seconds), mph, incline, heart,thisevent );
		       }

                      scroller();
			
                  } 
		      else {
                      //  $('#ConsoleText').append(sprintf("Skipping timepoint %s for key %s\n",seconds,key));
                      }
                      timehash[seconds] = 1;		
		      speedinclineChartInstance.redraw();		     
		      heartChartInstance.redraw(); 
                 });

      }  // if evt.data

  } //else

} // function onMessage

    function onError(evt) {
        // writeToScreen('ERROR:' + evt.data);
    }

    function doSend(thisMessage) {

	if (test) {
	    $('#ConsoleText').append("TEST MODE - not sending\n");
	    scroller();

        } else {
	   // $('#ConsoleText').append("LIVE MODE\n" + thisMessage);
            websocket.send(thisMessage);
	    scroller();
	}
    }
    
    function writeToScreen(message) {
        $('#output').append(message + '<br />');
    }
    
}); //jquery
