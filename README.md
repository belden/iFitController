
# iFitController

Simple websockets client proof of concept to control NordicTrack iFit enabled treadmills.  

Can capture data from the socket and send events during exercise and allow for storing and graphing.  No root access to android treadmill controller needed or was required, standard port 80 on version 3.4.0324.0.0.5.2.3 of firmware is open to IP ANY/ANY. This may change, so you may want to freeze the version on your treadmill. 

No reverse engineering was required, we simply used the [repair tool access from iFit](https://ifit.zendesk.com/hc/en-us/articles/201800660-Reinstall-iFit-Software-Repair-Tool), then exit to desktop as they explain then start Astro.  From there /var/log/messages contained all the connections to the uthttpd process that controls the treadmill functions.  

Replaying these events via a remote websocket resulted in speed, incline and other changes.  Turns out they are simple JSON formatted strings such as:

````
#SETSPEED
#start & speed:
{ "values": {"MPH":"2" },"type":"set" }

#stop
{ "values": {"MPH":"0" },"type":"set" }

#FAN
#stop
{ "values": {"Fan Speed":"0" },"type":"set" }

#half
{ "values": {"Fan Speed":"50" },"type":"set" }
````

Sliders have been built to replicate these.  In addition while there is an active websockets connectio, events from the machine are relayed to all hosts connected, we keyed off the chest heart rate sensor and capture speed and incline into a CSV format file that can be downloaded after your session for use in Excel etc.

Here you can see Elmo enjoying his ride.  We hope this software is useful for others.

<p align="center">
<img src="images/ElmoOnTheMove.gif?raw=true" alt="Elmo" />
</p>

## Installing

Set Treadmill address in ifit.js

````
// Set IP address of treadmill..

var treadmill = "10.0.1.6";
````

Load ifit.html into your browser from file:///

```
file:///Users/jcuff/iFitController/ifit.html 
```

or pop it on a webserver that can see your treadmill...  you will want to password protect that page if you have children or spouses who like to mess with your run.  The websocket on these treadmills are wide open as of the current firmware, which is great for this application, but bad for security.

There's a Download Run Data button that will dump the events to a csv file so you can open in Excel etc. to look at your run.  Currently keyed off chest heart rate events and any other changes to elevation and or speed.

## Packages used

Kudos and thanks to each of the following that were used to build this app:

* [repair tool access from iFit](https://ifit.zendesk.com/hc/en-us/articles/201800660-Reinstall-iFit-Software-Repair-Tool)
* [jQuery](http://jquery.com/download/)
* [d3js](https://d3js.org)
* [sprintf](https://github.com/alexei/sprintf.js)
* [epoch](http://epochjs.github.io/epoch/)

**NOTE:  All trademarks are of their respective owners.**  

**This application is in NO WAY affiliated or endorsed with or by any product!**

## Authors

* **[James Cuff](http://twitter.com/jamesdotcuff)** 
* **[Michele Clamp](http://twitter.com/micheleclamp)** 


## TODO

* Add "workouts" to be able to replay previous workouts, and/or challenges e.g. rolling hills, intervals etc.
* Alexa style voice commands could be fun.  e.g. "Alexa, set treadmill to five miles per hour"

## Acknowledgments

* Hat tip to Ventz! 

### Examples:

![Alt text](images/screenie.png?raw=true "Screenie")
![Alt text](images/screenieexcel.png?raw=true "Excel Screenie")

