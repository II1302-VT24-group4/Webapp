import firebaseConfig from "/src/firebaseConfig";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// initialize the firebase app
const app = initializeApp(firebaseConfig);

// initialize the database
const db = getFirestore()

// exports for google auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};










