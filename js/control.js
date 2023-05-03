
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {getDatabase, ref, get, set, child, update, remove, serverTimestamp}
from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8J9exsuO12uO_1h2i1LUm5PmI_aO4ELc",
    authDomain: "reto-abe85.firebaseapp.com",
    databaseURL: "https://reto-abe85-default-rtdb.firebaseio.com",
    projectId: "reto-abe85",
    storageBucket: "reto-abe85.appspot.com",
    messagingSenderId: "134245474037",
    appId: "1:134245474037:web:28977d364c016333c82fbc",
    measurementId: "G-NS0H62LFPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//initialize firebase database
console.log("firebase-database.js loaded");
const db = getDatabase();


//get elements from html
var onoffbtn=document.getElementById("estadoClimaBoton")
var tempActualPag=document.getElementById("tempActualPag")
var tempComfActual=document.getElementById("tempComfActual")

//update current temperature shown on site from firebase
function updateTemp(){
    const dbref = ref(db);
  
    get(dbref).then((snapshot)=>{
      if(snapshot.exists()){
        tempActualPag.innerHTML = snapshot.val().tempactual;
      }
      else{
        alert("No data found");
      }
    })
    .catch((error)=>{
      alert("Unsuccesful,error "+error);
    });
  
  }
// This function retrieves the on/off status and temperature values from the Firebase Realtime Database
function getOnOffStatus() {
    // Get a reference to the Firebase Realtime Database
    const dbref = ref(db);
    
    // Retrieve data from the database
    get(dbref).then((snapshot) => {
      // If the data exists, update the UI with the values
      if (snapshot.exists()) {
        tempComfActual.innerHTML = snapshot.val().TempComf;
        if (snapshot.val().onoffvalue) {
          onoffbtn.innerHTML = "PRENDIDO";
          updateTemp();
        } else {
          onoffbtn.innerHTML = "APAGADO";
          tempActualPag.innerHTML = "N/A";
        }
      } else {
        // If there is no data, alert the user
        alert("No data found");
      }
    })
    .catch((error) => {
      // If there is an error, alert the user with the error message
      alert("Unsuccesful,error " + error);
    });
  }
  
  // When the DOM content is loaded, call the getOnOffStatus() function to retrieve the initial values
  document.addEventListener("DOMContentLoaded", function() {
    getOnOffStatus();
  });

    // Function to generate a random 16-character ID for new status entries
    function generateId() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < 16; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return id;
    }
 // Function to change the on/off status of the climate control system
function changeOnOffStatus() {
    const dbRef = ref(db);
    const currentValue = onoffbtn.innerHTML;
    let newValue;
    const id = generateId();
    const time = serverTimestamp();
  
    // Check if the system is currently on or off and toggle the status accordingly
    if (currentValue === "PRENDIDO") {
      newValue = "APAGADO";
      update(dbRef, { onoffvalue: false });
      tempActualPag.innerHTML = "N/A";
      set(ref(db,"onofflog/"+id), {
        id: id,
        onoffnow: "OFF",
        time: time
      });
    } else {
      newValue = "PRENDIDO";
      updateTemp()
      update(dbRef, { onoffvalue: true });
      set(ref(db,"onofflog/"+id), {
        id: id,
        onoffnow: "ON",
        time: time
      });
      
    }
  
    // Update the UI with the new status
    onoffbtn.innerHTML = newValue;
  }
  
  // Run the changeOnOffStatus function when the button is clicked
  estadoClimaBoton.addEventListener("click",changeOnOffStatus);
  
  // Get the temperature slider and its current value
  const slider = document.getElementById("sliderTemperatura");
  const sliderValue = document.querySelector(".slider-value");
  var actualizarTempComf = document.getElementById("actTempComf");
  
  // Function to update the comfort temperature value in Firebase when the slider is changed
  function changeTempComf() {
    const dbRef = ref(db);
    update(dbRef, { TempComf: parseInt(slider.value) }); // use parseInt() to convert slider.value to an integer
    tempComfActual.innerHTML = slider.value;
  }
  
  
  // Run the changeTempComf function when the "Actualizar" button is clicked
  actualizarTempComf.addEventListener("click", changeTempComf);
  
