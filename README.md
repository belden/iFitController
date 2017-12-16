
# iFitController

Simple websockets client proof of concept


### Installing

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

For a demo see: [Elmo On The Move Movie](ElmoOnTheMove.mov)


## Authors

* **James Cuff** 
* **Michele Clamp** 


## Acknowledgments

* Hat tip to Ventz! 

### Examples:


![Alt text](images/screenie.png?raw=true "Screenie")
![Alt text](images/screenieexcel.png?raw=true "Excel Screenie")

