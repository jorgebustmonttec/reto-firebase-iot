
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
//   apiKey: "AIzaSyDS5AUQeq5SGVKwqHjXcMcNXXsGqHJE_5g",
//   authDomain: "test-47f75.firebaseapp.com",
//   projectId: "test-47f75",
//   storageBucket: "test-47f75.appspot.com",
//   messagingSenderId: "770601390412",
//   appId: "1:770601390412:web:da789bf83989d697a1bfe9",
//   measurementId: "G-MDC8J96GBM"
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

var namebox = document.getElementById("Namebox");
var rollbox = document.getElementById("Rollbox");
var secbox = document.getElementById("Secbox");
var genbox = document.getElementById("Genbox");

var insbtn = document.getElementById("Insbtn");
var selbtn = document.getElementById("Selbtn");
var updbtn = document.getElementById("Updbtn");
var delbtn = document.getElementById("Delbtn");
//Insert Data into firebase
function InsertData(){
  set(ref(db,"Students/"+rollbox.value),{
    StudentName: namebox.value,
    StudentRollNo: rollbox.value,
    StudentSection: secbox.value,
    StudentGender: genbox.value

  })
  .then(()=>{
    alert("Data Inserted");
  })
  .catch((error)=>{
    alert("unsuccesful, error"+error);
  })
}

//function to update on/off status of ac unit in the site
//function getonoff
//    if onoff is on
//    return true
//    else
//    return false

function getOnOffStatus(){
  const dbref = ref(db);

  get(dbref).then((snapshot)=>{
    if(snapshot.exists()){
      if(snapshot.val().onoffvalue){
        onoffbtn.innerHTML = "PRENDIDO";

      }
      else{
        onoffbtn.innerHTML = "APAGADO";
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

window.addEventListener('load', () => {
  getOnOffStatus();
});


function changeOnOffStatus() {
  const dbRef = ref(db);
  const currentValue = onoffbtn.innerHTML;
  let newValue;

  if (currentValue === "PRENDIDO") {
    newValue = "APAGADO";
    update(dbRef, { onoffvalue: false });
  } else {
    newValue = "PRENDIDO";
    update(dbRef, { onoffvalue: true });
  }

  onoffbtn.innerHTML = newValue;
}

//make it so function runs on button click
estadoClimaBoton.addEventListener("click",changeOnOffStatus);

//Select Data from firebase

function SelectData(){
    const dbref = ref(db);

    get(child(dbref,"Students/"+rollbox.value)).then((snapshot)=>{
      if(snapshot.exists()){
        namebox.value = snapshot.val().StudentName;
        secbox.value = snapshot.val().StudentSection;
        genbox.value = snapshot.val().StudentGender;
      }
      else{
        alert("No data found");
      }
    })
    .catch((error)=>{
      alert("Unsuccesful,error "+error);
    });
}

//Update Data from firebase

function UpdateData(){
    update(ref(db,"Students/"+rollbox.value),{
        StudentName: namebox.value,
        StudentSection: secbox.value,
        StudentGender: genbox.value
    
      })
      .then(()=>{
        alert("Data Updated");
      })
      .catch((error)=>{
        alert("unsuccesful, error"+error);
      })
    }

//Delete Data from firebase

function DeleteData(){
    remove(ref(db,"Students/"+rollbox.value))
      .then(()=>{
        alert("Data removed");
      })
      .catch((error)=>{
        alert("unsuccesful, error"+error);
      })
    }

//assign event to button
insbtn.addEventListener("click",InsertData);
selbtn.addEventListener("click",SelectData);
updbtn.addEventListener("click",UpdateData);
delbtn.addEventListener("click",DeleteData);


