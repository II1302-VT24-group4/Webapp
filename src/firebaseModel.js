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

// exports for google auth
export const auth = getAuth(app);

// initialize the firebase app
const app = initializeApp(firebaseConfig);

// initialize the database
const db = getFirestore()





