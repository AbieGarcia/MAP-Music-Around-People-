// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuoRzl1w4ZzQ1amT4JvWPJr149Qe-ZFpk",
    authDomain: "music-around-people.firebaseapp.com",
    projectId: "music-around-people",
    storageBucket: "music-around-people.firebasestorage.app",
    messagingSenderId: "653606731059",
    appId: "1:653606731059:web:5987f1ad955e11694f1246"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);