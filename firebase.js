import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGcTjpOhYLrvGFEMBMeHvD1KdTIF22JqY",
  authDomain: "expense-tracker-fdc61.firebaseapp.com",
  projectId: "expense-tracker-fdc61",
  storageBucket: "expense-tracker-fdc61.firebasestorage.app",
  messagingSenderId: "1078232849482",
  appId: "1:1078232849482:web:c46201109780a14c351ab3",
  measurementId: "G-X2F9EPS51W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);