// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBCSPpj2JPTn9552mTkjgQiOeXvtoctzE",
  authDomain: "oauth-9c68c.firebaseapp.com",
  projectId: "oauth-9c68c",
  storageBucket: "oauth-9c68c.firebasestorage.app",
  messagingSenderId: "761109803762",
  appId: "1:761109803762:web:5993af1d5fd05861efd66b",
  measurementId: "G-32EWS8SYHN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
