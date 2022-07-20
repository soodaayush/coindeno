import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCktIk2YhS79ieikrfev_mUTdK3KFDs3n8",
  authDomain: "soodmax-reactnative.firebaseapp.com",
  databaseURL: "https://soodmax-reactnative-default-rtdb.firebaseio.com/",
  projectId: "soodmax-reactnative",
  storageBucket: "soodmax-reactnative.appspot.com",
  messagingSenderId: "12345-insert-yourse",
  appId: "1:84723869958:web:e7c3521bd475cae3d51687",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
