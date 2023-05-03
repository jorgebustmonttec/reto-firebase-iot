
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
const dbRef = ref(db);


var tempLista = [];
var timeLista = [];
var onOffLista = [];
var timeOnOffLista = [];

const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  };


const date= new Date();

function getAllDataOnce() {
    return new Promise((resolve, reject) => {
      get(child(dbRef, "estatus"))
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((childSnapshot) => {
            data.push({
              temp: childSnapshot.val().temp,
              time: new Date(childSnapshot.val().time),
            });
          });
          // Sort the data array by time
          data.sort((a, b) => a.time - b.time);
          // Extract the sorted temperature and time arrays
          const tempLista = data.map((item) => item.temp);
          const timeLista = data.map((item) => item.time.toLocaleString('en-US', options));
          resolve({ tempLista, timeLista });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  

getAllDataOnce().then(({ tempLista, timeLista }) => {
    // Create chart data
    const chartData = {
      labels: timeLista,
      datasets: [
        {
          label: 'Temperature',
          data: tempLista,
          borderColor: 'teal',
          backgroundColor: 'rgba(0, 128, 128, 0.1)',
          fill: true,
        },
      ],
    };
  
    // Create chart options
    const chartOptions = {
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'MMM D, h:mmA'
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            scaleLabel:  {
              display: true,
              labelString: 'Temperatura'
            }
          }
        ]
      },
    };
  
    // Get canvas element
    const ctx = document.getElementById('myChart').getContext('2d');
  
    // Create chart
    const chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  }).catch((error) => {
    console.log("Error: " + error);
  });

  function getOnOffData() {
    const onOffRef = child(dbRef, "onofflog");
  
    return new Promise((resolve, reject) => {
      get(onOffRef)
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((childSnapshot) => {
            data.push({
              onOff: childSnapshot.val().onoffnow,
              time: childSnapshot.val().time,
            });
          });
          // Sort the data array by time
          data.sort((a, b) => a.time - b.time);
          // Extract the sorted onOff and time arrays
          const onOffLista = data.map((item) => item.onOff);
          const timeOnOffLista = data.map((item) => item.time);
          resolve({ onOffLista, timeOnOffLista });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  

  getOnOffData().then(({ onOffLista, timeOnOffLista }) => {
    //log out both arrays
    console.log(onOffLista);
    console.log(timeOnOffLista);
    //close loop
  }).catch((error) => {
    console.log("Error: " + error);
  });