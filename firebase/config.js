import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCktIk2YhS79ieikrfev_mUTdK3KFDs3n8",
  authDomain: "soodmax-reactnative.firebaseapp.com",
  databaseURL: "https://soodmax-reactnative-default-rtdb.firebaseio.com",
  projectId: "soodmax-reactnative",
  storageBucket: "soodmax-reactnative.appspot.com",
  messagingSenderId: "84723869958",
  appId: "1:84723869958:web:cd6f54f0ac465b50d51687",
  measurementId: "G-W5T2VRX7QZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
