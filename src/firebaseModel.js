import firebaseConfig from "/src/firebaseConfig";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

// initialize the firebase app
export const app = initializeApp(firebaseConfig);

// initialize the database
export const db = getFirestore();

// Get all meeting rooms from databse
const roomsRef = collection(db, "rooms");
const roomsData = await getDocs(roomsRef);
export const dbRooms = roomsData.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

// Adding documents test
// Add a new document in collection "cities"

// exports for google auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };

export async function dbInsert(
  coll,
  entity,
  subColl,
  subEntity,
  attribute,
  data,
  merge
) {
  const userRef = doc(db, coll, entity);
  if (
    subColl === null ||
    subColl === undefined ||
    subEntity === null ||
    subEntity === undefined
  ) {
    await setDoc(userRef, { [attribute]: data }, { merge: merge });
  } else {
    const subcollectionRef = collection(userRef, subColl);
    const docRef = doc(subcollectionRef, subEntity);
    await setDoc(docRef, { [attribute]: data }, { merge: merge });
  }
}

export async function dbRead(coll, entity, subColl, subEntity) {
  let query = collection(db, coll);
  let docs = true;

  if (entity) {
    docs = false;
    query = doc(query, entity);
    if (subColl) {
      docs = true;
      query = collection(query, subColl);
      if (subEntity) {
        docs = false;
        query = doc(query, subEntity);
      }
    }
  }

  if (docs) {
    let data = await getDocs(query);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    let data = await getDoc(query);
    return { id: data.id, ...data.data() };
  }
}

export function googleSignInOut(model) {
  //console.log(model.isLoggedIn)
  if (!model.user) {
    signInWithPopup(auth, new GoogleAuthProvider()).then(successfulLoginACB);
  } else {
    signOut(auth);
    model.user = null;
    model.isLoggedIn = false;
    window.location.hash = "#/";
    console.log(auth);
  }

  function successfulLoginACB(fbUserChunk) {
    //model.user_ID = fbUserChunk.user.uid;
    //model.userState = true;
    //console.log(fbUserChunk)

    model.user = fbUserChunk.user.uid;
    model.isLoggedIn = true;
    //console.log(model)
    window.location.hash = "#/home";
    //console.log("Successful login! Welcome "+auth.currentUser.email);

    //create a new user entry in database

    const userRef = doc(db, "users", model.user);
    setDoc(userRef, { email: fbUserChunk.user.email }, { merge: true });
  }
}

function connectToFirebase(model) {
  onAuthStateChanged(auth, loginOrOutACB);

  function loginOrOutACB(user) {
    //console.log(user.uid)

    if (user) {
      model.userState.user = user.uid;
      model.userState.isLoggedIn = true;
    }

    if (!user) {
      model.userState.user = null;
      model.userState.isLoggedIn = false;
    }

    //console.log(model.userState)
  }
}

export default connectToFirebase;
