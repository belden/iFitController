var treadmill = "10.0.1.6";
var test      = false;
var websocket;

function scroller(){
   var console = $('#ConsoleText');
   console.scrollTop(
       console[0].scrollHeight - console.height()
   );
}

$(function() {

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
      $('#ConsoleText').append("SETTING " + parentdata.stub + " to " + this.value + "\n"); scroller();
	scroller();

	if (websocket) {
	    doSend(message);
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
    scroller();
  }

  var counter = 0;

  function onMessage(evt) {

      // first packet is magic - store it, don't update graph
      if (counter == 0) {
          var parsed = JSON.parse(evt.data, (key, value) => {
              if (key != "values" && key != ""){
                  $('#ConsoleText').append(sprintf("%-28s %s\n",key, value));
              }
              scroller();
          });
          counter++;
          $('#ConsoleText').append("\n--------------------------------------------\n\n");
          scroller();

      } else {
          if (evt.data != '{ }') {
              var parsed = JSON.parse(evt.data, (key, value) => {
		  now = new Date()

		  // check not blank and toss "totals" from inbound stream
		  if (key != "values" && key != "" && key != "Total Time" && key != "Total Miles" && key != "Kilometers"){
                      $('#ConsoleText').append(sprintf("%-38s %s\n",key, value));
                      scroller();
		  }
              });
          }
      }  //else
  } 

    function onError(evt) {
        writeToScreen('ERROR:' + evt.data);
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
    
});
