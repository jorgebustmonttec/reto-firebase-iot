
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
