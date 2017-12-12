// Set IP address of treadmill..

var treadmill = "10.0.1.6";


var websocket;

function scroller(){
    var console = $('#ConsoleText');
    console.scrollTop(
       console[0].scrollHeight - console.height()
    );
}

jQuery(function ($) {

    $('#ConsoleText').append("iFit Treadmill Websockets Command (version 1.2_js)\n");
    $('#ConsoleText').append("jquery, ds3, sprintf\n\n");
    $('#ConsoleText').append("Initializing...\n\n");
    $('#ConsoleText').append("\n\nInstructions\n-----------------------------------------------\n");
    $('#ConsoleText').append("Use 'Connect' to be able to send commands.\n\nSliders will send active parameters on release.\n");
    $('#ConsoleText').append("\nUse 'Disconnect' to close websocket communication.\n\n");

    $('#connect').click(doConnect);
    $('#disconnect').click(doDisconnect);

    var slideIncline = document.getElementById("InclineSlider");
    var slideSpeed = document.getElementById("SpeedSlider");
    var slideFan = document.getElementById("FanSlider");

    var SpeedTxt = document.getElementById("speedLabel");
    var InclineTxt = document.getElementById("inclineLabel");
    var FanTxt = document.getElementById("fanLabel");

    InclineTxt.innerHTML = 0;
    FanTxt.innerHTML = 0;
    SpeedTxt.innerHTML = 0;

    // Slider update label, seperate so not to flood controller

    slideIncline.oninput = function() {
        InclineTxt.innerHTML = this.value;
    }

    slideFan.oninput = function() {
        FanTxt.innerHTML = this.value;
    }

    slideSpeed.oninput = function() {
        SpeedTxt.innerHTML = this.value;
    }


    function doConnect() {

    // Slider action - use "onchange" function so we don't flood the controler

    slideIncline.onchange = function() {
      InclineTxt.innerHTML = this.value;
      inclinevalue = this.value;
      messageIncline = sprintf("{ \"values\": {\"Incline\":\"%d\" },\"type\":\"set\" }\n",this.value);
      $('#ConsoleText').append("SETTING INCLINE to " + this.value + "\n"); scroller();
      doSend(messageIncline);
    }

    slideFan.onchange = function() {
      FanTxt.innerHTML = this.value;
      fanvalue = this.value;
      messageFan = sprintf("{ \"values\": {\"Fan Speed\":\"%d\" },\"type\":\"set\" }\n",this.value);
      $('#ConsoleText').append("SETTING FAN to " + this.value + "\n"); scroller();
      doSend(messageFan);
    }

    slideSpeed.onchange = function() {
      SpeedTxt.innerHTML = this.value;
      speedvalue = this.value;
      messageSpeed = sprintf("{ \"values\": {\"MPH\":\"%f\" },\"type\":\"set\" }\n",this.value);
      $('#ConsoleText').append("SETTING SPEED to " + this.value + "\n"); scroller();
      doSend(messageSpeed);
    }
 
// end of slider config


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
   } 

   function doDisconnect() {
      websocket.close();
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
         if (counter==0) {
             var parsed = JSON.parse(evt.data, (key, value) => {
                 if (key != "values" && key != ""){
                   $('#ConsoleText').append(sprintf("%-28s %s\n",key, value));
                 }
                 scroller();
             });
             counter++;
                $('#ConsoleText').append("\n--------------------------------------------\n\n");
                scroller();
         }

       else {
          if (evt.data != '{ }'){
          var parsed = JSON.parse(evt.data, (key, value) => {
              now = new Date()

       // check not blank and toss "totals" from inbound stream
            if (key != "values" && key != "" && key != "Total Time" && key != "Total Miles" && key != "Kilometers"){
                $('#ConsoleText').append(sprintf("%-38s %s\n",key, value));
                scroller();
            }
          });
        }
      } //data
     } //else

     function onError(evt) {
        writeToScreen('ERROR:' + evt.data);
      }

      function doSend(thisMessage) {
         scroller();
         websocket.send(thisMessage);
      }

      function writeToScreen(message) {
        $('#output').append(message + '<br />');
      }

  }); //end of jQuery

