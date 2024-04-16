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

export function googleSignInOut(model) {
  signInWithPopup(auth,new GoogleAuthProvider())
  .then(successfulLoginACB)

  function successfulLoginACB(fbUserChunk){
      model.user_ID = fbUserChunk.user.uid;
      model.userState = true;
      window.location.hash="#/home";
      //console.log("Successful login! Welcome "+auth.currentUser.email);
  }
}








