import firebaseConfig from "/src/firebaseConfig";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";

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
  deleteDoc,
  deleteField,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

// initialize the firebase app
export const app = initializeApp(firebaseConfig);

const storage = getStorage();
export async function uploadFileToStorage(file, fileName, room, date, time) {
  console.log("File to upload:", file); // Logga filen som ska laddas upp
  console.log("File name:", fileName); // Logga filnamnet

  const storageRef = ref(storage, `${room}/${date}/${time}/${fileName}`);
  console.log("Storage reference:", storageRef); // Logga lagringsreferensen

  const uploadTask = uploadBytesResumable(storageRef, file);

  try {
    await uploadTask; // Vänta på att uppladdningen slutförs
    const downloadURL = await getDownloadURL(storageRef);
    console.log("File available at", downloadURL); // Logga nedladdnings-URL:en
    return downloadURL;
  } catch (error) {
    console.error("Upload process failed:", error); // Logga eventuella fel
    throw error;
  }
}

export async function dbGetFiles(room, date, time) {
  const folderRef = ref(storage, `${room}/${date}/${time}`);

  try {
    // List all items (files and subfolders) within the specified folder
    const folderContents = await listAll(folderRef);

    // Get file data (name and download URL) for each file
    const fileData = await Promise.all(folderContents.items.map(async (item) => {
      const fileRef = ref(storage, `${room}/${date}/${time}/${item.name}`);
      const downloadURL = await getDownloadURL(fileRef);
      return { name: item.name, downloadURL: downloadURL };
    }));

    // Return array of objects containing file name and download URL
    return fileData;
  } catch (error) {
    console.error("Error getting file data in time folder:", error);
    throw error;
  }
}

// initialize the database
export const db = getFirestore();

// Get all meeting rooms from databse
const roomsRef = collection(db, "rooms");
const roomsData = await getDocs(roomsRef);
export const dbRooms = roomsData.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));
console.log(dbRooms);

// Get all users in the database
const usersRef = collection(db, "users");
const usersData = await getDocs(usersRef);
export const dbUsers = usersData.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));
//console.log(dbUsers);


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

export async function dbDelete(coll, entity, subColl, subEntity) {
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
    await deleteField(query);
  } else {
    await deleteDoc(query);
  }
}

export async function dbUpdateMeetingsField(coll, entity, value) {
  const docRef = doc(collection(db, coll), entity);

  try {
    // Check if the document exists
    const docSnap = await getDoc(docRef);
    if (docSnap && docSnap.data()) {
      // Document exists, update the meetings field
      await updateDoc(docRef, {
        meetings: arrayUnion(value)
      });
    } else {
      // Document doesn't exist, create it with the meetings field
      await setDoc(docRef, { meetings: [value] });
    }
  } catch (error) {
    console.error('Error updating meetings field:', error);
  }
}


export async function dbRemoveFromMeetingsField(coll, entity, value) {
  const docRef = doc(collection(db, coll), entity);
  try {
    // Update the document by removing the value from the meetings field
    await updateDoc(docRef, {
      meetings: arrayRemove(value)
    });
  } catch (error) {
    console.error('Error removing value from meetings field:', error);
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
    window.location.hash = "#/myCalendar";
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
