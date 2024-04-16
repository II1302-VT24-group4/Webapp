import firebaseConfig from "/src/firebaseConfig";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, onValue } from "firebase/database"; // import more when needed see teacher firebase from labs
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const PATH = "app";

// order of placement matters here so do not sort
function modelToPersistence(model) {
  return {
    query: model.searchParams.q,
    favorites: model.mediaFavourites,
  };
}

// objects fetched on fav page open so no need to get it
function persistenceToModel(data, model) {
  if (data) {
    if (data.query || data.query === "") model.searchParams.q = data.query;

    if (data.favorites) model.mediaFavourites = data.favorites;

    if (data?.favourites?.length === 0) model.mediaFavourites = [];
  }
}

function saveToFirebase(model) {
  if (model.ready && model.userState.isLoggedIn)
    set(
      ref(db, PATH + "/" + model.userState.user.uid),
      modelToPersistence(model)
    );
}

function readFromFirebase(model) {
  if (model.userState.isLoggedIn) {
    onValue(ref(db, PATH + "/" + model.userState.user.uid), updateDataACB);
    model.ready = false;

    get(ref(db, PATH + "/" + model.userState.user.uid))
      .then(getTheDataACB)
      .then(modelReadyACB);
    function getTheDataACB(snapshot) {
      return persistenceToModel(snapshot.val(), model);
    }
    function modelReadyACB() {
      model.ready = true;
      if (!model.searchResultsPromiseState.data) model.doSearch();
    }

    function updateDataACB(snapshot) {
      if (model.ready) {
        return persistenceToModel(snapshot.val(), model);
      }
    }
  }
}

function connectToFirebase(model, watchFunction) {
  onAuthStateChanged(auth, ReadModelFromFireBaseACB);
  watchFunction(checkModelDataACB, saveModelToFireBaseACB);

  function checkModelDataACB() {
    return [
      model.favArrayChanged,
      model.histArrayChanged,
      model.mediaFavourites,
      model.mediaHistory,
      model.searchParams.q,
    ];
  }
  function saveModelToFireBaseACB() {
    saveToFirebase(model);
  }
  function ReadModelFromFireBaseACB(user) {
    if (user) {
      model.userState.user = user;
      model.userState.isLoggedIn = true;
      if (model.queryBeforeLogin)
        set(
          ref(db, PATH + "/" + model.userState.user.uid + "/query"),
          model.queryBeforeLogin
        );
      readFromFirebase(model);
    } else {
      model.userState.user = null;
      model.userState.isLoggedIn = false;
      model.mediaFavourites = [];
    }
  }
}

export function googleSignInOut(userState) {
  if (userState.isLoggedIn) {
    signOut(auth)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  } else {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }
}

export default connectToFirebase;
