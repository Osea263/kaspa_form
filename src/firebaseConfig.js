import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

// import "dotenv/config"

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIDHQL1yT3CVW1CEVj7dKQY6Ag9wFBewc",
  authDomain: "kaspa-form-af0b3.firebaseapp.com",
  projectId: "kaspa-form-af0b3",
  storageBucket: "kaspa-form-af0b3.appspot.com",
  messagingSenderId: "303151902789",
  appId: "1:303151902789:web:656dbef7a02c39923bb32c"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore()