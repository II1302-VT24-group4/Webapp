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

// Get all meeting rooms from databse
const roomsRef = collection(db, "rooms");
const roomsData = await getDocs(roomsRef)
export const dbRooms = roomsData.docs.map((doc) => ({id: doc.id, ...doc.data()}))



// Adding documents test
// Add a new document in collection "cities"


// exports for google auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};

export function googleSignInOut(model) {
  
  //console.log(model.isLoggedIn)
  if(!model.user) {signInWithPopup(auth,new GoogleAuthProvider())
  .then(successfulLoginACB)
  } else {
    model.user = null
    model.isLoggedIn = false
    window.location.hash="#/";
    console.log(model)
  }

  

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
      setDoc(userRef, {email: fbUserChunk.user.email}, { merge: true });

      
  }
}








