// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-lmT3m9BLCKFXdAOaA8Y0lSTGCutwdjg",
  authDomain: "smms-otp.firebaseapp.com",
  projectId: "smms-otp",
  storageBucket: "smms-otp.firebasestorage.app",
  messagingSenderId: "397128923098",
  appId: "1:397128923098:web:dce57db0742d88a65532e3",
  measurementId: "G-58HZ71BFQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };