// GROUP: Austin Ramos and Novi Wang

//Sleep


#include <SimbleeBLE.h>

int buttonA = 0;
int buttonB = 0;
int pulse=0;
int breaterate = 0;

//IT IS LONG THAT MIGHT GIVE PROBLEMS
long sleepstart = 0;
long sleepend = 0;
//enum to control sleep state. each will have a counter
//int associated with it

int currentposition = 1; //will use same naming convetion as tags
// int 1 = back, 2 = right side 3 = left side 4
int backcount = 0;
int right_sidecount = 0;
int left_sidecount = 0;
int stomachcount = 0;


boolean TimerStart = false;
boolean isOn = false;
int hours = 0;
  int minutes = 0;
    int seconds = 0;
    int end_time = 0;
    int start = 0;

   boolean gentleAlarm = false;

 
boolean offTimerStart = false;
int hours2 = 0;
int minutes2 = 0; 
int seconds2 =0;
      int end_time2 = 0;
    int start2 = 0;
//fade vars
boolean fadeStart = false;
int fademins = 0;
int fadesecs = 0;
int fadeduration = 0;
int start3 = 0;
int end_time3 = 0;


    
char* outData;
void setup() {

    
  // TODO: Change the "ledbtn" string to a unique 2-5 letter code for your group 
  SimbleeBLE.advertisementData = "Sleep";
  Serial.begin(9600);
  pinMode(3, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, INPUT);
  pinMode(6, INPUT);
  // start the BLE stack
  SimbleeBLE.begin();
}





//FOR Gentle Wakeup:
//set up timer as usual, then send tag 0x0704MMSS
//with MMSS being the minutes and seconds bytes.
//start the timer as usual with 0702.
//timer will work accordingly

void loop() {


  
  //Start of group code, checks if button has been pressed and if so send a packet with the button tag (0x01)
  
  //PART 6 MANUAL on/off
  int temp1 = digitalRead(5);//buttonA
  if (buttonA != temp1) {  //Checks to see if the button has changed, so we don't continuously send packets when pressed
    buttonA = temp1;
    if (buttonA == 1) { //Only sends on press, not release

 //increments the pulse by 1.

 //actually need to send as char array cant send int like this...
     pulse++;
     //figure this out... hard to do without device.
     //sends the pulse to the device to have a "live" update so to speak

outData = new char[2];
       outData[0] = pulse;
      outData[1] = breaterate;
      SimbleeBLE.send(outData, 2);

    }
  }
  
  int temp2 = digitalRead(6); //buttonB
  if (buttonB != temp2) {  //Checks to see if the button has changed, so we don't continuously send packets when pressed
    buttonB = temp2;
    if (buttonB == 1) { //Only sends on press, not release
    breaterate++;  
 
outData = new char[2];
       outData[0] = pulse;
         outData[1] = breaterate;
     
      SimbleeBLE.send(outData, 2);

    
    }

  }

//on timer loop, simple delta time
if(TimerStart){

if(!gentleAlarm){
  
  if(millis()>=end_time){

     
Serial.println("   time done");
   analogWrite(2,0xFF);// turning lights on to signifiy the end of the timer
      analogWrite(3,0xFF);
      analogWrite(4,0xFF);
 
    TimerStart = false;      
  }
}
else{
  

  //the fading method is a bit confusing. 
//so, it gets the max val of the three, and runs a for loop to that 
//then, it checks each iteration if the rgb val and increments  
 // when their respective values are less then the max val, sets it
 //to i (one RGB value higher than before)


//starting at the total end time minus the fade duration.
//should cleanly tell us when to start "waking"
//them up
Serial.println(fadeduration);
    if(millis()>= (end_time - fadeduration)){

     
Serial.println("   time done");
   analogWrite(2,0xFF);// turning lights on to signifiy the end of the timer
      analogWrite(3,0xFF);
      analogWrite(4,0xFF);
 
       
  
 for(int i = 0; i<=255;i++){// fade to current color level of red over course of fadeduration


   analogWrite(2, i);
  

  
     analogWrite(3, i);
  
  
     analogWrite(4, i);
  
  

    
    delay(fadeduration/(255+1));
//    delay(red/fadeduration * (double)5/13);
    if(i==255){
      Serial.println("Color has fully appeared!");
    }
      }

//ends the timer.
  TimerStart = false; 
    }


  }
  }




    
  }
  
  
  
  
  

void SimbleeBLE_onReceive(char data[], int len) {
  //on timer with fade functionality
 if (data[0] == 0x01){

  //using second tag for timer. for example
  //0x0701HHMMSS will "set the on-timer"
  //0x0702 will start the on timer
  //0x0703 will get the time left on the timer
  //recieving 2 bytes for hour, 2 for min 2 bytes for seconds.
 


//**** so write now it is saving the min and secs as hex values, which I suspect is messing up the 
//3rd bit when they are all options. try converting to decimal first.
  if(data[1] == 01){ //first subtag -> sets time
     //0x0701HHMMSS sets timer, HH - hours, MM= mins, SS = secs
    //set the timer.
    hours = data[2];
   
 minutes = data[3];
 //minutes and hours working. not sending
   seconds = data[4];

    Serial.print(" hours: ");
      Serial.print(hours);
       Serial.print("      minutes: ");
      Serial.print(minutes);
       Serial.print("      seconds: ");
      Serial.print(seconds);
    }
if(data[1] == 0x02){
 


//delta time;
 start = millis();

 end_time = start + ((3600*hours +60*minutes+ seconds)*1000);
 Serial.print("Timer end time - millis(): ");
  Serial.print(end_time - millis() );
 TimerStart = true;
  Serial.print("Timer Starting!");
   Serial.println("    Time remaining (in ms): ");
  Serial.print(end_time- millis());
 
  }
  if(data[1] == 03){
    //0x0703 will get time on ontimer
    if(TimerStart == false){
    Serial.println("    Timer not currently running.");
    
    }
      if(TimerStart == true){
   
    
 Serial.println("    Time remaining (in ms): ");
  Serial.print(end_time- millis());
  SimbleeBLE.send(end_time- millis()); //notification to the phon
      }
 }
 if(data[1] == 04){
  //code for setting up gentle alarm and fade
 

    //set the timer. 
    //0x0104MMSS sets the fade duration, where SS is the duration in seconds
  fademins = data[2]; //gets fade duration only in seconds(since only 1-10 seconds.
 fadesecs = data[3];
   fadeduration = (60*fademins+ fadesecs)*1000;
   Serial.print("fade duration: ");
    Serial.println(fadeduration);
   
  
    SimbleeBLE.send(fadeduration);


 start3 = millis();

 end_time3 = start3 +(60*fademins+ fadesecs)*1000;
   gentleAlarm = true;
  }
 }
 //sleep position.
  if (data[0] == 0x02){
    if(data[1] == 0x01){
//we  will set the sleep position if this is the case.

      if(data[2] == 0x01){
        currentposition = 1;
        //save the amount of times switched to back.
        backcount++;
        Serial.println("Sleep position changed to back");
  
        
        }
        if(data[2] == 0x02){
        currentposition = 2;
        right_sidecount++;
        Serial.println("Sleep position changed to right side");

        
        }
        if(data[2] == 0x03){
        currentposition = 3;
        left_sidecount++;
        Serial.println("Sleep position changed to left side");
    
        }
        if(data[2] == 0x04){
        currentposition = 4;
        stomachcount++;
        Serial.println("Sleep position changed to stomach");
   
        }
  }
  //return current sleep position
if(data[1]==0x02){

//int backcount = 0;
//int right_sidecount = 0;
//int left_sidecount = 0;
//int stomachcount = 0;

  outData = new char[6];
       outData[0] = 0xFF;
         outData[1] = currentposition;
          outData[2] = backcount;
           outData[3] = right_sidecount;
           outData[4] = left_sidecount;
           outData[5] =stomachcount;
           SimbleeBLE.send(outData, 6);

  
  Serial.print("Current position: ");
  if(currentposition == 1){
    Serial.print("Back");
  
  
  
  }
     if(currentposition == 2){
    Serial.print("right side");
     }
     if(currentposition == 3){
    Serial.print("left side");
     }
     if(currentposition == 4){
    Serial.print("stomach");
  }
  
  }
//01 -> set it
//02 -> get current sleep position
//03 get summary of information


  }
  //general stop/start for 
  //perhaps we will calcualte actual "breath and pulse" rates here.
if(data[0] == 0x03){

  //start
  if(data[1] == 0x01){
    //this is not an alarm timer, it is literally
    //keeping track of how long you are sleeping
    Serial.print("now tracking sleep!");
    sleepstart = millis();
    
    }
    //stop timer
     if(data[1] == 0x02){
    //this is not an alarm timer, it is literally
    //keeping track of how long you are sleeping
    Serial.print("now Stopping sleep!");
    sleepend = millis();
    Serial.print("Total Sleep: ");
    Serial.print(sleepend- sleepstart);
    
    }
    
  }
  
  }

