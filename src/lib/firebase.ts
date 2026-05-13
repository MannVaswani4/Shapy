import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THESE with your actual Firebase project settings from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDST5Vs0Tc15ry0I4LUUCcWAjws9D3IMa0",
  authDomain: "shapy-b275a.firebaseapp.com",
  projectId: "shapy-b275a",
  storageBucket: "shapy-b275a.firebasestorage.app",
  messagingSenderId: "789061810808",
  appId: "1:789061810808:web:eeed8534dc7029c2204b8d",
  measurementId: "G-G0QVF7HK0H"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
