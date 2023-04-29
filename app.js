
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS5AUQeq5SGVKwqHjXcMcNXXsGqHJE_5g",
  authDomain: "test-47f75.firebaseapp.com",
  projectId: "test-47f75",
  storageBucket: "test-47f75.appspot.com",
  messagingSenderId: "770601390412",
  appId: "1:770601390412:web:da789bf83989d697a1bfe9",
  measurementId: "G-MDC8J96GBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {getDatabase, ref, set, child, update, remove}
from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
console.log("firebase-database.js loaded");
const db = getDatabase();
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
