
#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>
#include "DHT.h"
#include "Adafruit_Sensor.h"
#include "SD.h"
#include <time.h>
#include "string"
#define TEMP_SENSOR D1
#define sensorType DHT11
#define redPin D4
#define bluePin D5
// TO DO
const char* WIFI_SSID = "???"; //Replaces ??? with the name of your WiFi network
const char* WIFI_PASSWORD = "???"; //Replaces ??? with the password of your WiFi network
String id;
//Inicializar el sensor de temperatura
DHT dht(TEMP_SENSOR,sensorType);

#define FIREBASE_HOST "reto-abe85-default-rtdb.firebaseio.com/" //Replaces ??? with the name of your database at Firebase (without the https//:)
#define FIREBASE_AUTH "g2cTU4TVZdQI2JiuAUbFSxRznK4vwRcBq2VWGO7J" //Replaces ??? with the authentication key of your database at Firebase
//end TO DO
int temperaturaActual;
int tempComf;
bool onOff;
bool onOffPasado = false;
long PastTime = 0;
char msg2[50];
char msg16[50];
String onOffNow;
//Define FirebaseESP8266 data object
FirebaseData firebaseData;
FirebaseData LED16state;
FirebaseJson json;

void setup_wifi() {
    delay(100);
    Serial.println();
    Serial.print("macAddress: ");
    Serial.println(WiFi.macAddress());
    //Connect to WiFi
    Serial.println();
    Serial.print("Connecting to WiFi: ");
    Serial.println(WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi is now connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}//end setup_wifi()

void setup() {
    Serial.begin(115200);
    setup_wifi();
    
    pinMode(TEMP_SENSOR,INPUT);
    pinMode(redPin,OUTPUT);
    pinMode(bluePin,OUTPUT);
    dht.begin();

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Firebase.reconnectWiFi(true);
    setClock();

    if(Firebase.RTDB.setBool(&firebaseData, "/onoffvalue",onOffPasado)){
            Serial.println("Estatus del Abanico al principio: ");
            Serial.print(onOffPasado);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
        analogWrite(redPin,0);
        analogWrite(bluePin,0);
}//end setup()
 
 String generateRandomID() {
  const char charset[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const int idLength = 16;
  String randomID = "";

  for (int i = 0; i < idLength; i++) {
    randomID += charset[random(0, sizeof(charset) - 1)];
  }

  return randomID;
}

void loop() {
    long now = millis();  //Get the system clock in milliseconds
    //Validate (by time control) if 0.5 seconds have passed since the previous report
    
    if (now - PastTime > 60000) {
        PastTime = now;
        time_t current_time = time(nullptr);
        int time = int((current_time));
        temperaturaActual = int(dht.readTemperature());
        
        //Sending data to FIREBASE
        if(Firebase.RTDB.setInt(&firebaseData, "/tempactual",temperaturaActual)){
            Serial.println("Temperatura actual: ");
            Serial.print(temperaturaActual);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
        
        //Reading data from FIREBASE
        if(Firebase.RTDB.getInt(&firebaseData, "/TempComf")) {
          if(firebaseData.dataType() == "int"){
            tempComf = firebaseData.intData();
            Serial.println("Succesful READ from " + firebaseData.dataPath() + ": " + tempComf + " (" + firebaseData.dataType() + ") ");
          }
        }
        // Enseñando si va a enfriar o calentar
        if(temperaturaActual < tempComf) {
          onOffNow = "On";
          onOff = true;
          analogWrite(redPin, 255);
          analogWrite(bluePin,0);
          // Estatus Valor
          if(Firebase.RTDB.setBool(&firebaseData, "/onoffvalue",onOff)){
            Serial.println("Estatus del abanico: ");
            Serial.print(onOff);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          // Registros OnOffLog
          if(onOff != onOffPasado) {
          id = generateRandomID();
          if(Firebase.RTDB.setString(&firebaseData, "/onofflog/"+ id + "/id",id)){
            Serial.println("Idtus del abanico: ");
            Serial.print(id);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setString(&firebaseData, "/onofflog/" + id + "/onoffnow",onOffNow)){
            Serial.println("Estatus del abanico: ");
            Serial.print(onOffNow);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/onofflog/"+ id + "/time",time)){
            Serial.println("Tiempo del abanico: ");
            Serial.print(time);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          onOffPasado = onOff;
          }
          // Registro Estatus temperatura
          id = generateRandomID();
          if(Firebase.RTDB.setString(&firebaseData, "/estatus/"+id+"/id",id)){
            Serial.println("id de la temp: ");
            Serial.print(id);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/estatus/"+id+"/temp",temperaturaActual)){
            Serial.println("Temperatura actual: ");
            Serial.print(temperaturaActual);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/estatus/"+id+"/time",time)){
            Serial.println("tiempo de la temperatura: ");
            Serial.print(time);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          
          
        }

        if(tempComf < temperaturaActual) {
          onOff = true;
          onOffNow = "On";
          analogWrite(redPin, 0);
          analogWrite(bluePin,255);
          if(Firebase.RTDB.setBool(&firebaseData, "/onoffvalue",onOff)){
            Serial.println("Estatus del abanico: ");
            Serial.print(onOff);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }

             // Registros OnOffLog
          if(onOffPasado != onOff) {
          id = generateRandomID();
          if(Firebase.RTDB.setString(&firebaseData, "/onofflog/"+ id + "/id",id)){
            Serial.println("Id del abanico: ");
            Serial.print(id);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setString(&firebaseData, "/onofflog/" + id + "/onoffnow",onOffNow)){
            Serial.println("Estatus del abanico: ");
            Serial.print(onOffNow);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/onofflog/"+ id + "/time",time)){
            Serial.println("tiempo del abanico: ");
            Serial.print(time);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          onOffPasado = onOff;
          }

          // Registro Estatus temperatura
          id = generateRandomID();
          if(Firebase.RTDB.setString(&firebaseData, "/estatus/"+id+"/id",id)){
            Serial.println("id de la temperatura: ");
            Serial.print(id);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/estatus/"+id+"/temp",temperaturaActual)){
            Serial.println("Temperatura actual: ");
            Serial.print(temperaturaActual);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/estatus/"+id+"/time",time)){
            Serial.println("Tiempo de la temperatura: ");
            Serial.print(time);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          
        }

        if(tempComf == temperaturaActual) {
          onOff = false;
          onOffNow = "Off";
          analogWrite(redPin,0);
          analogWrite(bluePin,0);
          if(Firebase.RTDB.setBool(&firebaseData, "/onoffvalue",onOff)){
            Serial.println("Estatus del abanico: ");
            Serial.print(onOff);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }

             // Registros OnOffLog
          if(onOffPasado != onOff) {
          id = generateRandomID();
          if(Firebase.RTDB.setString(&firebaseData, "/onofflog/"+ id + "/id",id)){
            Serial.println("Estatus del abanico: ");
            Serial.print(id);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setString(&firebaseData, "/onofflog/" + id + "/onoffnow",onOffNow)){
            Serial.println("Id del abanico: ");
            Serial.print(onOffNow);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          if(Firebase.RTDB.setInt(&firebaseData, "/onofflog/"+ id + "/time",time)){
            Serial.println("tiempo del abanico: ");
            Serial.print(time);
            Serial.print(" - saved to: " + firebaseData.dataPath());
            Serial.println(" (" + firebaseData.dataType() +  ") ");
          } else {
          Serial.println("FAILED: " + firebaseData.errorReason());
          }
          onOffPasado = onOff;
          }
          
        }

    }// end validate
}//end loop()


void setClock() {
  configTime(0, 0, "pool.ntp.org");
  Serial.println("Waiting for NTP time sync...");
  while (!time(nullptr)) {
    delay(1000);
    Serial.println("Trying to get time...");
  }
  Serial.println("Time synchronized");
}
