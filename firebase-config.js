// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDb1UXjiEUJX20EigX00IaKupWnVunYy6I",
authDomain: "shadow-work-course.firebaseapp.com",
projectId: "shadow-work-course",
storageBucket: "shadow-work-course.firebasestorage.app",
messagingSenderId: "1023145338538",
appId: "1:1023145338538:web:e1c35722de8b7480fe92d3",
measurementId: "G-QXCDKWYJP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
