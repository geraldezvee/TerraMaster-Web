import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCAYosq5yChZCb7wTxhjLksbIl3wTjBRhA",
    authDomain: "terramaster-6f801.firebaseapp.com",
    projectId: "terramaster-6f801",
    storageBucket: "terramaster-6f801.appspot.com",
    messagingSenderId: "735703701299",
    appId: "1:735703701299:web:7d25bbc057d61309429046"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
