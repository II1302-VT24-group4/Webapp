import { resolvePromise } from "/src/resolvePromise.js";
import React, { useEffect } from "react";
import { googleSignInOut } from "./firebaseModel.js";
import {useState} from "react";
import { dbRooms, db } from "./firebaseModel.js";
const defaultLimit = 400;
const rooms = await dbRooms;


export default {
  queryBeforeLogin: "",
  searchParams: { q: "", _limit: 400, _offset: 0 },
  userState: { user: null, isLoggedIn: false }, //logged in user
  searchResultsPromiseState: {},
  searchDone: { done: false },
  rooms: rooms,

 

  logInOrOutWithGoogle() {
    //logs in or out using google
    this.queryBeforeLogin = this.searchParams.q;
    
    googleSignInOut(this.userState);
  },

  //returns the max amount more results can be gotten from the more results method
  getMaxResults() {
    if (this.searchResultsPromiseState.data) {
      const urlParams = new URLSearchParams(
        this.searchResultsPromiseState.data.last["@id"]
      );
      let currOffset = urlParams.get("_offset");
      if (!currOffset) currOffset = 0;
      this.prevMaxResults =
        (currOffset - this.searchParams._offset) / defaultLimit;
      return this.prevMaxResults;
    } else {
      return this.prevMaxResults;
    }
  },

  currentQuery: "",
  searchResultsPromiseState: {},
  mediaFavourites: [],
  userState: { user: null, isLoggedIn: false }, //logged in user
  ready: true, //the state of the model compared to firebase
  types: [
    //an array of all search types to choose from
    "office1", // Stockholm
    "office2", // Göteborg
    "office3", // Malmö
    "office4", // Uppsala
    "office5", // Västerås
    "office6", // Örebro
    "other", // Other offices
  ],

  isNavOpen: { open: false },
  isalertMessage: { message: "" },
  isshowAlert: { alert: false },
  isSearchIconActive: { active: false },
  typeList: {},
  imageHolder: {},
  queryBeforeLogin: "",
  logInOrOutWithGoogle() {
    //logs in or out using google
    this.queryBeforeLogin = this.searchParams.q;
    googleSignInOut(this.userState);
  },

  setSearchQuery(textForQuery) {
    //Sets the query for the search as the text inputted
    this.searchParams.q = textForQuery;
  },
  setSearchType(type) {
    //Search for specific building
    this.searchParams.type = type;
  },
  searchDone: { done: false },
  favouritesDone: { done: false },
  //gets more results if there are any by  doing a search after incrementing the offset by the limit.
  amountOfPages: 1,
  doMoreSearch() {
    this.amountOfPages++;
    for (let i = 0; i < Object.keys(this.typeList).length; i++) {
      let objName = Object.keys(this.typeList)[i];
      const itemInfo = {};
      itemInfo.id = "Page Number";
      itemInfo.title = this.amountOfPages;
      this.typeList[objName].push(itemInfo);
    }

    this.searchParams._offset += this.searchParams._limit;
    this.searchParams._limit = defaultLimit;
    if (this.searchResultsPromiseState.data && this.getMaxResults() >= 0) {
      this.searchResultsPromiseState.data = null;
      this.searchResultsPromiseState.error = null;

      resolvePromise(
        searchMedia({
          q: this.currentQuery,
          _limit: this.searchParams._limit,
          _offset: this.searchParams._offset,
        }),
        this.searchResultsPromiseState
      );
    }
  },

  //Searches for the query in searchParams and saves it to searchResultsPromiseState.data
  doSearch() {
    this.amountOfPages = 1;
    this.currentQuery = this.searchParams.q;
    this.searchDone.done = true;
    this.prevMaxResults = null;
    this.searchParams._limit = defaultLimit; // Antag att defaultLimit är definierat någonstans i koden
    this.searchParams._offset = 0;

    this.typeList = {
      office1: [], // Stockholm
      office2: [], // Göteborg
      office3: [], // Malmö
      office4: [], // Uppsala
      office5: [], // Västerås
      office6: [], // Örebro
      other: [], // Other offices
    };
    resolvePromise(
      searchMedia(this.searchParams),
      this.searchResultsPromiseState
    );
  },

  //Results from mapping favourites
  favHistTypeList: {},
  favHistImageHolder: {},

  //boolean to say if the favourite
  favHistReady: { ready: false },

  //Takes an array of ids Favourite and saves the data to the favHistTypeList and images to favHistImageHolder
  getInfoOfArray(favHistArray) {
    this.favHistReady.ready = false;
    this.favHistImageHolder = {};
    this.favHistTypeList = {
      office1: [], // Stockholm
      office2: [], // Göteborg
      office3: [], // Malmö
      office4: [], // Uppsala
      office5: [], // Västerås
      office6: [], // Örebro
      other: [], // Other offices
    };
    const imageHolder = this.favHistImageHolder;
    const favHistReady = this.favHistReady;
    const origArrLen = favHistArray.length;
    const typeList = this.favHistTypeList;
    let completeItems = 0;
    if (origArrLen == 0) favHistReady.ready = true;

    function getItemInfoCB(id) {
      function errorDataACB(error) {
        console.log(error);
        completeItems++;
        if (completeItems == origArrLen) favHistReady.ready = true;
      }

      function saveDataACB(data) {
        const item = data["@graph"][1];
        sortIntoTypes(typeList, item, imageHolder);
        completeItems++;
        if (completeItems == origArrLen) favHistReady.ready = true;
      }
      searchById(id).then(saveDataACB, errorDataACB).catch(errorDataACB);
    }
    favHistArray.map(getItemInfoCB);
  },

  prevMaxResults: null,

  //returns the max amount more results can be gotten from the more results method
  getMaxResults() {
    if (this.searchResultsPromiseState.data) {
      const urlParams = new URLSearchParams(
        this.searchResultsPromiseState.data.last["@id"]
      );
      let currOffset = urlParams.get("_offset");
      if (!currOffset) currOffset = 0;
      this.prevMaxResults =
        (currOffset - this.searchParams._offset) / defaultLimit;
      return this.prevMaxResults;
    } else {
      return this.prevMaxResults;
    }
  },

  //switches when an item has been removed from the array to signal firebase to sync
  histArrayChanged: false,
  favArrayChanged: false,

  //Saves an room to mediaFavourites
  saveToFavourites(room) {
    if (!this.mediaFavourites.includes(room.id))
      this.mediaFavourites = [room.id, ...this.mediaFavourites];
  },

  //Removes an room from mediaFavourites

  removeFromFavourites(room) {
    if (this.mediaFavourites.includes(room.id)) {
      switch (room.type) {
        case "office1": // Stockholm
          this.favHistTypeList.office1 =
            this.favHistTypeList.office1.filter(removeFromList);
          break;
        case "office2": // Göteborg
          this.favHistTypeList.office2 =
            this.favHistTypeList.office2.filter(removeFromList);
          break;
        case "office3": // Malmö
          this.favHistTypeList.office3 =
            this.favHistTypeList.office3.filter(removeFromList);
          break;
        case "office4": // Uppsala
          this.favHistTypeList.office4 =
            this.favHistTypeList.office4.filter(removeFromList);
          break;
        case "office5": // Västerås
          this.favHistTypeList.office5 =
            this.favHistTypeList.office5.filter(removeFromList);
          break;
        case "office6": // Örebro
          this.favHistTypeList.office6 =
            this.favHistTypeList.office6.filter(removeFromList);
          break;
        default: // Other offices
          this.favHistTypeList.other =
            this.favHistTypeList.other.filter(removeFromList);
          break;
      }
      function removeFromList(listRoom) {
        return listRoom.id !== room.id;
      }
      this.mediaFavourites.splice(this.mediaFavourites.indexOf(room.id), 1);
      this.favArrayChanged = !this.favArrayChanged; // Toggle favArrayChanged state
    }
  },
  //gets the info of the items in the promisestate
  getRooms() {
    const typeList = this.typeList;
    const imageHolder = this.imageHolder;
    this.searchResultsPromiseState.data.items.map(mapToTypesCB);
    function mapToTypesCB(item) {
      sortIntoTypes(typeList, item, imageHolder);
    }
  },
};

//sorts the items into different types
function sortIntoTypes(typeList, item, imageHolder) {
  if (item.hasTitle?.[0]?.mainTitle) {
    switch (item?.instanceOf?.["@type"]) {
      case "office1":
        typeList.office1.push(mapItems(item, imageHolder));
        break;
      case "office2":
        typeList.office2.push(mapItems(item, imageHolder));
        break;
      case "office3":
        typeList.office3.push(mapItems(item, imageHolder));
        break;
      case "office4":
        typeList.office4.push(mapItems(item, imageHolder));
        break;
      case "office5":
        typeList.office5.push(mapItems(item, imageHolder));
        break;
      case "office6":
        typeList.office6.push(mapItems(item, imageHolder));
        break;
      // OTHER
      default:
        typeList.other.push(mapItems(item, imageHolder));
        break;
    }
  }
}

//Used to extract usable data from the api result
function mapItems(item, imageHolder) {
  const itemInfo = {};
  const itemId = item["@id"];

  let type;
  if (item?.instanceOf?.["@type"]) type = item.instanceOf?.["@type"];
  else type = null;

  let title;
  if (item.hasTitle?.[0]?.mainTitle) title = item.hasTitle[0].mainTitle;
  else title = null;

  let summary;
  if (item.summary?.[0]?.label) summary = item.summary[0].label;
  else summary = null;

  let nonFormattedDate;
  if ((nonFormattedDate = item.publication?.[0]?.nonFormattedDate));
  else nonFormattedDate = null;

  let author;
  if (
    (author = item?.responsibilityStatement) //author kanske inte finns om admin skapar mötet
  );
  else author = null;

  let meetingLink;
  if (item.sameAs?.[0]?.["@id"]) {
    meetingLink = "test.se";
  }

  itemInfo.id = itemId;
  itemInfo.type = type;
  itemInfo.title = title;
  itemInfo.summary = summary;
  itemInfo.nonFormattedDate = nonFormattedDate;
  itemInfo.author = author;
  itemInfo.meetingLink = meetingLink;
  imageHolder[itemId] = "https://i.ibb.co/NyzjMQh/room-placeholder.webp";

  return itemInfo;
}

function searchMedia(searchParams) {
  //Söksystem måste göras om totalt
  const options = {
    method: "GET",
    headers: { Accept: "application/ld+json" },
  };

  const response = fetch(
    url + "find?" + new URLSearchParams(searchParams),
    options
  );

  return response.then(getObjectACB, errorACB);
}
function searchById(idLink) {
  const options = {
    method: "GET",
    headers: { Accept: "application/ld+json" },
  };
  const response = fetch(idLink, options);
  return response.then(getObjectACB, errorACB);
}
function getObjectACB(response) {
  if (!response.ok) {
    throw new Error("Response not 200");
  }
  return response.json();
}
function errorACB(error) {
  console.log(error);
}
