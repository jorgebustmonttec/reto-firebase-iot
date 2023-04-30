
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import {getDatabase, ref, get, set, child, update, remove}
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
const analytics = getAnalytics(app);
//initialize firebase database
console.log("firebase-database.js loaded");
const db = getDatabase();
var onoffbtn=document.getElementById("estadoClimaBoton")
var tempActualPag=document.getElementById("tempActualPag")
var tempComfActual=document.getElementById("tempComfActual")


//function to update on/off status of ac unit in the site
//function getonoff
//    if onoff is on
//    return true
//    else
//    return false

//update current temperature shown on site from firebase
function updateTemp(){
  const dbref = ref(db);

  get(dbref).then((snapshot)=>{
    if(snapshot.exists()){
      tempActualPag.innerHTML = snapshot.val().tempactual;
      console.log(snapshot.val().tempactual);
    }
    else{
      alert("No data found");
    }
  })
  .catch((error)=>{
    alert("Unsuccesful,error "+error);
  });

}

function getOnOffStatus(){
  const dbref = ref(db);

  get(dbref).then((snapshot)=>{
    if(snapshot.exists()){
      tempComfActual.innerHTML = snapshot.val().TempComf;
      if(snapshot.val().onoffvalue){
        onoffbtn.innerHTML = "PRENDIDO";
        updateTemp();
        console.log(snapshot.val().tempactual);
      }
      else{
        onoffbtn.innerHTML = "APAGADO";
        tempActualPag.innerHTML = "N/A";
      }
    }
    else{
      alert("No data found");
    }
  })
  .catch((error)=>{
    alert("Unsuccesful,error "+error);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  getOnOffStatus();
});


function changeOnOffStatus() {
  const dbRef = ref(db);
  const currentValue = onoffbtn.innerHTML;
  let newValue;

  if (currentValue === "PRENDIDO") {
    newValue = "APAGADO";
    update(dbRef, { onoffvalue: false });
    tempActualPag.innerHTML = "N/A";
  } else {
    newValue = "PRENDIDO";
    updateTemp()
    update(dbRef, { onoffvalue: true });
  }

  onoffbtn.innerHTML = newValue;
}

//make it so function runs on button click
estadoClimaBoton.addEventListener("click",changeOnOffStatus);

const slider = document.getElementById("sliderTemperatura");
const sliderValue = document.querySelector(".slider-value");
var actualizarTempComf = document.getElementById("actTempComf");

//update tempcomf value from slider

function changeTempComf() {
  const dbRef = ref(db);
  update(dbRef, { TempComf: slider.value });
  tempComfActual.innerHTML = slider.value;
}

actualizarTempComf.addEventListener("click", changeTempComf);
