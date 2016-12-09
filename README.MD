this project serves as a proof of concept for an Internet of Things
Based Sleep monitor. the hardware is a Simbleee with BLE capabilities, programmed
in Arduino C. The front end is a non native iphone app created using Apache 
Cordova, Javascript, and HTML. In theory, with working hardware(accelerometer,
heart rate sensor, pulse oximeter, etc), the application is able to 
communicate with the device using Bluetooth Low Energy, and transmit 
relevent data.
Included features:

-the application allows you to set an alarm with a "gentle wakeup"
feature. as proof of concept, a light on the simblee will begin to fade on
sometime prior to when the alarm is set, dependent on the parameters you
give the alarm clock.

-The device can "track" which sleep positions are your favorite. As a proof
of concept, you can change the sleep position on the app and it will store it
on the arduino side of the application. ideally it would work with an
accelerometer.

-keep track of heart rate and pulse rate.

-graph relevant information using chart.js library  

Check the document titled "Basic Settings" for an overview of the tag structure
used on the arduino side to communicate with the iphone application.
