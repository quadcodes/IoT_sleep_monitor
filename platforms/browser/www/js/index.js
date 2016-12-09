// Heavily based on Bluetooth Low Energy Lock (c) 2014-2015 Don Coleman
// See: https://github.com/MakeBluetooth/ble-lock/blob/master/phonegap/www/js/index.js
var SERVICE_UUID = 'FE84';
var WRITE_UUID = '2d30c083-f39f-4ce6-923f-3484ea480596';
var READ_UUID = '2d30c082-f39f-4ce6-923f-3484ea480596';
var sleepposition = 0;
var back = 0;
var right_side = 0;
var left_side = 0;
var stomach = 0;

//******   Utility functions (not used here yet) ******
function stringToArrayBuffer(str) {
    // assuming 8 bit bytes
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
        console.log(ret[i]);
    }
    return ret.buffer;
}
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}



var app = {

    // Initialized the app. Hide content / etc.
    initialize: function() {
        console.log("initialize");

        // Do initial screen configuration.
        // This can be done here because this file is loaded from the HTML file.
        deviceListScreen.hidden = false;
        console.log(" deviceListScreen.hidden = false;");
        sleepControl.hidden = true;
           console.log(" sleepControl.hidden = true;");
        setTimer.hidden = true;
           console.log("  setTimer.hidden = true;");
        //bfDetail.hidden = true;
       //  hrDetail.hidden = true;
        document.getElementById("hrDetail").hidden = true;
          console.log("document.getElementById(\"hrDetail\").hidden = true;");
         document.getElementById("bfDetail").hidden = true;
           console.log("document.getElementById(\"bfDetail\").hidden = true;");
      //  posDetail.hidden = true;
      document.getElementById("posDetail").hidden = true;
        // Disable the refresh button until the app is completely ready
        refreshButton.disabled = true;

        // Register to be notified when the "device is ready"
        // This delays the execution of any more code until all the Cordova code is loaded.
        // (This file may be loaded before the Cordova.js file is loaded and, consequently,
        //  shouldn't use any of Cordova's features)
        // See: http://cordova.apache.org/docs/en/6.x/cordova/events/events.html#page-toc-source
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },

    //button actions
     set_Timer_Page : function(){
        //hiding the main control pannel div and showing the ontimer div
        console.log("settimer");
        //hide the old div and show the new one
        
        //this function is simply setting up the dive for the on timer page
        document.getElementById("sleepControl").hidden = true;
        document.getElementById("setTimer").hidden = false;
    },
   
     //this function is simply to go back to the main control panel from the on timer button
     back_from_set_timer_function : function(){
        //app logic to hide timer div and go back to main screen 
         document.getElementById("sleepControl").hidden = false;
        document.getElementById("setTimer").hidden = true;
    },
    
    bf_Detail_Page : function(){
        //hiding the main control pannel div and showing the ontimer div
        console.log("bfDetail");
        //hide the old div and show the new one
        
        //this function is simply setting up the dive for the on timer page
        document.getElementById("sleepControl").hidden = true;
        document.getElementById("hrDetail").hidden = true;
        document.getElementById("bfDetail").hidden = false;
       
    },
   
     //this function is simply to go back to the main control panel from the on timer button
     back_from_bfdetail_function : function(){
     console.log("BACK TO MAIN******");
        //app logic to hide timer div and go back to main screen 
         document.getElementById("sleepControl").hidden = false;
        document.getElementById("bfDetail").hidden = true;
        document.getElementById("hrDetail").hidden = true;
    },
    
    hr_Detail_Page : function(){
        //hiding the main control pannel div and showing the ontimer div
        console.log("hrDetail");
        //hide the old div and show the new one
        
        //this function is simply setting up the dive for the on timer page
        document.getElementById("sleepControl").hidden = true;
        document.getElementById("bfDetail").hidden = true;
        document.getElementById("hrDetail").hidden = false;
       
    },
   
     //this function is simply to go back to the main control panel from the on timer button
     back_from_hrdetail_function : function(){
        //app logic to hide timer div and go back to main screen 
         document.getElementById("sleepControl").hidden = false;
        document.getElementById("bfDetail").hidden = true;
        document.getElementById("hrDetail").hidden = true;
    },

    pos_Detail_Page : function(){
        //hiding the main control pannel div and showing the ontimer div
        console.log("posDetail");
          var data=new Uint8Array(2);
    data[0]=0x02;
    data[1]=0x02;
    app.writeData(data);
        
        //hide the old div and show the new one
        
        //this function is simply setting up the dive for the on timer page
        document.getElementById("sleepControl").hidden = true;
        document.getElementById("posDetail").hidden = false;
    },
   
     //this function is simply to go back to the main control panel from the on timer button
     back_from_posdetail_function : function(){
        //app logic to hide timer div and go back to main screen 
         document.getElementById("sleepControl").hidden = false;
        document.getElementById("posDetail").hidden = true;
},
startsleep_function: function(){
    console.log("start sleep");
    var data=new Uint8Array(2);
    data[0]=0x03;
    data[1]=0x01;
    app.writeData(data);
},
endsleep_function: function(){
     console.log("end sleep");
    var data=new Uint8Array(2);
    data[0]=0x03;
    data[1]=0x02;
    app.writeData(data);
},
settimer_function : function(){
        // we get hours, minutes, and seconds from the ontimer input page, convert them to hex values, and send them to the arduino
        var today=new Date();

        var hours = document.getElementById("onHours").value-today.getHours();
        var minutes = document.getElementById("onMinute").value-today.getMinutes();
        var seconds = document.getElementById("onSecond").value-today.getSeconds();
        if(hours<0){
            hours+=24;
        }
        if(minutes<0){
        hours-=1;
            minutes+=60;
        }
        if(seconds<0){
        minutes-=1;
            seconds+=60;
        }
        //convert time to string
        hex_hours = hours.toString(16);
        hex_minutes = minutes.toString(16);
        hex_seconds = seconds.toString(16);
             // console.log( "hex_seconds******")
              //console.log( hex_seconds)
              
              //we will both set the timer and start the timer when they press this button
              
              
              //sets the timer
          
         console.log("timer setting finished");     
          console.log("TESTTESTTEST");
        //timer start
        
        var data = new Uint8Array(5);
        
        data[0] = 0x01;
  
        data[1] = 0x01;

        data[2] = hex_hours;
       
        data[3] = hex_minutes;
       
        data[4] = hex_seconds;
   
       
         app.writeData(data);
         console.log("set timer done");
          app.setDuration_function();
    },

setDuration_function: function(){
console.log("duration setting finished");   
    var mduration = document.getElementById("mDuration").value;
    console.log("doc.getelementbyid.mduration");
    var sduration = document.getElementById("sDuration").value;
    console.log("doc.getelementbyid.sduration");
    hex_mduration = mduration.toString(16);
    console.log("hex");
    hex_sduration = sduration.toString(16);
    console.log("hex");
       console.log("about to write char array");
       
       
       //TEST NOW CHECK JS CONSOLE
       
       
        var data2 = new Uint8Array(4);
        console.log(" var data2 = new Uint8Array(4);");
        data2[0] = 0x01;
            console.log("  data2[0] = 0x01;");
        data2[1] = 0x04;
            console.log(" data2[1] = 0x04;");
        data2[2] = hex_mduration;
            console.log("data2[2] = hex_mduraiton;");
        data2[3] = hex_sduration;
        console.log( hex_mduration);
         console.log( hex_sduration);
        app.writeData(data2);
         
},
startTimer_function:function(){
 console.log("START TIMER *******");
    var data= new Uint8Array(2);
   
    data[0]=0x01;
    data[1]=0x02;
       app.writeData(data);
},
setPosition_function:function(peripheral){
console.log("SLEEP POSITION CHANGE");
	 var data = new Uint8Array(3);
	 data[0]=0x02;
    data[1]=0x01;
    
    
    
   
     var pos=document.getElementById("selectpos").value;
      document.getElementById("currentsleepposition").innerHTML = pos;
             if(pos=="back"){
                data[2]=0x01;
             }
             if(pos=="right"){
               data[2]=0x02;
             }
             if(pos=="left"){
               data[2]=0x03;
             }
             if(pos=="stomach"){
                data[2]=0x04;
             }
    app.writeData(data);
	 document.getElementById('backnum').innerHTML = back;
             document.getElementById('right_sidenum').innerHTML = right_side;
             document.getElementById('left_sidenum').innerHTML = left_side;
             document.getElementById('stomachnum').innerHTML = stomach;
             
},

// **** Callbacks for application "lifecycle" events. These respond to significant events when the App runs ******

    // the device is ready and the app can "start"
    onDeviceReady: function() {
        // Cordova is now ready --- do remaining Cordova setup.
        console.log("onDeviceReady");

        // Button/Touch actions weren't setup in initialize()
        // because they will trigger Cordova specific actions
        refreshButton.ontouchstart = app.uiOnScan;
        refreshButton.disabled = false;
        deviceList.ontouchstart = app.uiOnConnect;
      //   onButton.ontouchstart = app.uiOnLampOn;
      // offButton.ontouchstart = app.uiOnLampOff;
        disconnectButton.ontouchstart = app.uiOnDisconnect;


        var settimer = document.getElementById("settimerbutton");
   settimer.onclick = app.set_Timer_Page;
   
      var starttimer = document.getElementById("starttimerbutton");
  starttimer.onclick = app.startTimer_function;

   //buttons to go back to main page from on/off timers
  var back_from_set_timer = document.getElementById("timertomainpage");
    back_from_set_timer.onclick = app.back_from_set_timer_function;
  
   
     var bf = document.getElementById("bfButton");
   bf.onclick = app.bf_Detail_Page;
  var back_from_bfdetail = document.getElementById("bftomainpage");
    back_from_bfdetail.onclick = app.back_from_bfdetail_function;   
    
    var hr = document.getElementById("hrButton");
   hr.onclick = app.hr_Detail_Page;
  var back_from_hrdetail = document.getElementById("hrtomainpage");
    back_from_hrdetail.onclick = app.back_from_hrdetail_function;   


    var pos = document.getElementById("posButton");
   pos.onclick = app.pos_Detail_Page;
   
   var select=document.getElementById("selectpos");
   select.onchange=app.setPosition_function;
   
  var back_from_posdetail = document.getElementById("postomainpage");
    back_from_posdetail.onclick = app.back_from_posdetail_function;                
                
   var timer_set=document.getElementById("settimer");
   timer_set.onclick=app.settimer_function;

//call start/end sleep function when start/end sleep button is pressed
   var start_sleep=document.getElementById("startsleep");
   start_sleep.onclick=app.startsleep_function;

   var end_sleep=document.getElementById("endsleep");
   end_sleep.onclick=app.endsleep_function;
   
   //breath and heart rate counts are read
   // var bh_page=document.getElementById("bhDetail");
//    bh_page.ontouchstart=app.bf_function;
//    bh_page.ontouchstart=app.hr_function;
        // Call the uiOnScan function to automatically start scanning
        app.uiOnScan();
    },

// **** Callbacks from the user interface.  These respond to UI events ****

    // Start scanning (also called at startup)
    uiOnScan: function() {
        console.log("uiOnScan");

        deviceList.innerHTML = ""; // clear the list at the start of a uiOnScan
        app.uiShowProgressIndicator("Scanning for Bluetooth Devices...");

        // Start the uiOnScan and setup the "callbacks"
        ble.startScan([],
            app.bleOnDeviceDiscovered,
            function() { alert("Listing Bluetooth Devices Failed"); }
        );

        // Stop uiOnScan after 5 seconds
        setTimeout(ble.stopScan, 5000, app.bleOnScanComplete);
    },

    // An item has been selected, TRY to connect
    uiOnConnect: function (e) {
        console.log("uiOnConnect");
        // Stop scanning
        ble.stopScan();

        // Retrieve the device ID from the HTML element.
        var device = e.target.dataset.deviceId;
        // Request the connection
        ble.connect(device, app.bleOnConnect, app.bleOnDisconnect);

        // Show the status
        app.uiShowProgressIndicator("Requesting connection to " + device);
    },

    // The user has hit the Disconnect button
    uiOnDisconnect: function (e) {
        console.log("uiOnDisconnect");
        if (e) {
            e.preventDefault();
        }

        app.uiSetStatus("Disconnecting...");
        ble.disconnect(app.connectedPeripheral.id, function() {
            app.uiSetStatus("Disconnected");
            setTimeout(app.uiOnScan, 800);
        });
    },

    // uiOnLampOn: function() {
    //     console.log("uiOnLampOn");
    //     var data = new Uint8Array(1);
    //     data[0] = 0x1;
    //     app.writeData(data);
    // },

    // uiOnLampOff: function() {
    //     console.log("uiOnLampOff");
    //     var data = new Uint8Array(1);
    //     data[0] = 0x0;
    //     app.writeData(data);
    // },



// **** Callbacks from the "ble" Object: These respond to BLE events
    bleOnDeviceDiscovered: function(device) {
        console.log("bleOnDeviceDiscovered");

        // Show the list of devices (if it isn't already shown)
        app.uiShowDeviceListScreen();

        console.log(JSON.stringify(device));

        // Add an item to the list

        // 1. Build the HTML element
        var listItem = document.createElement('li');  // Start list item (li)
        // Add a custom piece of data to the HTML item (so if the HTML item is selected it will
        // be possible to retrieve the device ID).
        listItem.dataset.deviceId = device.id;
        var rssi = "";
        if (device.rssi) {
            rssi = "RSSI: " + device.rssi + "<br/>";
        }
        listItem.innerHTML = device.name + "<br/>" + rssi + device.id;
        // 2. Add it to the list
        deviceList.appendChild(listItem);

        // Update the status
        var deviceListLength = deviceList.getElementsByTagName('li').length;
        app.uiSetStatus("Found " + deviceListLength +
                      " device" + (deviceListLength === 1 ? "." : "s."));
    },

    bleOnScanComplete: function() {
        console.log("bleOnScanComplete");
        var deviceListLength = deviceList.getElementsByTagName('li').length;
        if (deviceListLength === 0) {
            app.uiShowDeviceListScreen();
            app.uiSetStatus("No Bluetooth Peripherals Discovered.");
        }
    },

    // At the completion of a successful connection
    bleOnConnect: function(peripheral) {
        console.log("bleOnConnect");
        // Save the peripheral object for later use
        app.connectedPeripheral = peripheral;
        app.uiShowControlScreen();
        app.uiSetStatus("Connected");
    
        ble.startNotification(app.connectedPeripheral.id, SERVICE_UUID, READ_UUID, function(buffer) {
             console.log("HR Read success");
             var data = new Uint8Array(buffer);
             console.log(data[0]);
             console.log(data[1]);
             
             if(data[0]== 0xFF){
             console.log("SLEEP POSITION INT: ")
             console.log(data[1]);
             sleepposition = data[1];
             if(data[1] == 01){
             document.getElementById('currentsleepposition').innerHTML = "Back";
             }
             else if(data[1] == 02){
             document.getElementById('currentsleepposition').innerHTML = "Right side";
             }
               else if(data[1] == 03){
             document.getElementById('currentsleepposition').innerHTML = "Left side";
             }
               else if(data[1] == 04){
             document.getElementById('currentsleepposition').innerHTML = "stomach";
             }
               else {
             document.getElementById('currentsleepposition').innerHTML = "Could not get position";
             }
             
        //      var back = 0;
// var right_side = 0;
// var left_side = 0;
// var stomach = 0;
             back = data[2];
              right_side = data[3];
              left_side = data[4];
              stomach = data[5];
             document.getElementById('backnum').innerHTML = back;
             document.getElementById('right_sidenum').innerHTML = right_side;
             document.getElementById('left_sidenum').innerHTML = left_side;
             document.getElementById('stomachnum').innerHTML = stomach;
             
             
             }else{
             document.getElementById('hrCount').innerHTML =data[1];
             document.getElementById('bfCount').innerHTML =data[0];
             }
            
         }, function() {
             alert("Failed read HR");
         });
    },

    bleOnDisconnect: function(reason) {
        console.log("bleOnDisconnect");
        if (!reason) {
            reason = "Connection Lost";
        }
        app.uiHideProgressIndicator();
        app.uiShowDeviceListScreen();
        app.uiSetStatus(reason);
    },

// ***** Functions that update the user interfaces
    uiShowProgressIndicator: function(message) {
        if (!message) { message = "Processing"; }
        progress.firstElementChild.innerHTML = message;
        progress.hidden = false;
        statusDiv.innerHTML = "";
    },

    uiHideProgressIndicator: function() {
        progress.hidden = true;
    },

    uiShowDeviceListScreen: function() {
        sleepControl.hidden = true;
        deviceListScreen.hidden = false;
        app.uiHideProgressIndicator();
        statusDiv.innerHTML = "";
    },

    uiShowControlScreen: function() {
        sleepControl.hidden = false;
        deviceListScreen.hidden = true;
        app.uiHideProgressIndicator();
        statusDiv.innerHTML = "";
    },

    uiSetStatus: function(message){
        console.log(message);
        statusDiv.innerHTML = message;
    },

// Utility function for writing data
    writeData: function(data) {
        console.log("Write");
        var success = function() {
            console.log("Write success");
        };

        var failure = function() {
            alert("Failed writing data");
        };
        ble.writeWithoutResponse(app.connectedPeripheral.id, SERVICE_UUID, WRITE_UUID, data.buffer, success, failure);
    },
};

// When this code is loaded the app.initialize() function is called
// to start setting up the application logic.
app.initialize();