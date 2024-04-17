import firebaseConfig from "/src/firebaseConfig";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, updateDoc, getDocs, getDoc} from "firebase/firestore";


// initialize the firebase app
export const app = initializeApp(firebaseConfig);

// initialize the database
export const db = getFirestore();

// Adding documents test
// Add a new document in collection "cities"


// exports for google auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};

export function googleSignInOut(model) {
  //console.log(model.user)
  //console.log(model.isLoggedIn)
  signInWithPopup(auth,new GoogleAuthProvider())
  .then(successfulLoginACB)

  

  function successfulLoginACB(fbUserChunk){
      //model.user_ID = fbUserChunk.user.uid;
      //model.userState = true;
      console.log(fbUserChunk)

      model.user = fbUserChunk.user.uid;
      model.isLoggedIn = true;
      //§console.log(model)
      window.location.hash="#/home";
      //console.log("Successful login! Welcome "+auth.currentUser.email);

      //create a new user entry in database
      
      const userRef = doc(db, 'users', model.user);
      setDoc(userRef, {email: fbUserChunk.user.email, RFID: 4321}, { merge: true });

      
  }
}








