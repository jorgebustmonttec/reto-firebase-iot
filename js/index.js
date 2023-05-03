
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


  // Function to generate a random 16-character ID for new status entries
  function generateId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 16; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }
  
  // Get the current temperature and the "Insertar" button
  var tempActual = document.getElementById("tempActual");
  var actTempbtn = document.getElementById("actTempActual");
  
  // Function to insert a new status entry with the current temperature and timestamp to Firebase
  function insertTemp() {
    const dbRef = ref(db);
    const id = generateId();
    const time = serverTimestamp();
  
    // Insert the new status entry with the generated ID, current temperature, and timestamp
    set(ref(db,"estatus/"+id), {
      id: id,
      temp: tempActual.value,
      time: time
    });
    update(dbRef, { tempactual: tempActual.value });

    
  
    // Log the data that was inserted to the console
    console.log("id: "+id);
    console.log("temp: "+tempActual.value);
  
    // Log the timestamp of the new status entry
    const dbref=ref(db);
    get(child(dbref,"estatus/"+id)).then((snapshot)=>{
      if(snapshot.exists()){
        console.log(new Date(snapshot.val().time));
      }
    })
  }
  
  // Run the insertTemp function when the "Insertar" button is clicked
  actTempbtn.addEventListener("click", insertTemp);

  console.log(new Date().getTime());
  