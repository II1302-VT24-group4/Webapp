import React, { useEffect } from "react";
import { googleSignInOut } from "./firebaseModel.js";
import { useState } from "react";
import { dbRooms, db, dbInsert, dbRead } from "./firebaseModel.js";
const defaultLimit = 400;
const rooms = await dbRooms;

export default {
  roomListDone: { roomListDone: false },
  queryBeforeLogin: "",
  searchParams: { q: "" },
  userState: { user: null, isLoggedIn: false }, //logged in user
  searchDone: { done: false },
  rooms: rooms,

  firebaseInsert(collection, entity, subCollection, subEntity, attribute, data, merge){
    dbInsert(collection, entity, subCollection, subEntity, attribute, data, merge);
  },

  firebaseRead(collection, entity, subCollection, subEntity){
    return dbRead(collection, entity, subCollection, subEntity);
  },

  logInOrOutWithGoogle() {
    //logs in or out using google
    this.queryBeforeLogin = this.searchParams.q;

    googleSignInOut(this.userState);
  },

  currentQuery: "",
  searchResultsPromiseState: {},
  mediaFavourites: [],
  userState: { user: null, isLoggedIn: false }, //logged in user
  ready: true, //the state of the model compared to firebase
  office: [], //an array of all offices to choose from. Populated automatically
  isNavOpen: { open: false },
  isAlertMessage: { message: "" },
  isShowAlert: { alert: false },
  officeList: {},
  imageHolder: {},
  favHistReady: { ready: false },
  favHistOfficeList: {},
  favHistImageHolder: {},
  queryBeforeLogin: "",

  setSearchQuery(textForQuery) {
    //Sets the query for the search as the text inputted
    this.searchParams.q = textForQuery;
  },
  setSearchOffice(office) {
    //Search for specific building
    this.searchParams.office = office;
  },
  searchDone: { done: false },
  favouritesDone: { done: false },

  //Searches for the query in searchParams and saves it to searchResultsPromiseState.data
  doSearch() {
    this.currentQuery = this.searchParams.q;

    this.searchResultsPromiseState.data = { items: rooms };
    this.searchDone.done = true;
    /*
    this.currentQuery = this.searchParams.q;
    let filteredRooms = rooms.filter((room) =>
      room.name.includes(this.currentQuery)
    );

    if (this.searchParams.office) {
      filteredRooms = filteredRooms.filter(
        (room) => room.office === this.searchParams.office
      );
    }

    this.searchResultsPromiseState.data = { items: filteredRooms };
    this.searchDone.done = true;
    */
  },
  sortIntoOffice(item) {
    // Anta att 'office' är ett nummer och vi behöver mappa det till en strängbaserad nyckel
    const officeKey = `office${item.office}`;

    // Kontrollera att en lista existerar för detta kontor i officeList
    if (!this.officeList[officeKey]) {
      this.officeList[officeKey] = []; // Initiera listan om den inte finns
    }

    const mappedRoom = this.mapOfficeRooms(item);
    this.officeList[officeKey].push(mappedRoom);
    console.log(`Added room to ${officeKey}:`, this.officeList[officeKey]);
  },
  //Takes an array of ids Favourite and saves the data to the favHistOfficeList and images to favHistImageHolder
  getInfoOfArray(favHistArray) {
    this.favHistReady.ready = false;
    this.favHistImageHolder = {};
    this.favHistOfficeList = this.initializeOffices();

    let completeItems = 0;
    if (favHistArray.length === 0) this.favHistReady.ready = true;

    favHistArray.forEach((id) => {
      const room = rooms.find((room) => room.id === id);
      if (room) {
        this.sortIntoOffice(room);
        this.favHistImageHolder[room.id] =
          "https://i.ibb.co/NyzjMQh/room-placeholder.webp";
        completeItems++;
      }
      if (completeItems === favHistArray.length) {
        this.favHistReady.ready = true;
      }
    });
  },

  saveToFavourites(room) {
    if (!this.mediaFavourites.includes(room.id)) {
      this.mediaFavourites.push(room.id);
      this.sortIntoOffice(room);
    }
  },

  removeFromFavourites(room) {
    const index = this.mediaFavourites.indexOf(room.id);
    if (index !== -1) {
      this.mediaFavourites.splice(index, 1);
      this.favHistOfficeList[room.office] = this.favHistOfficeList[
        room.office
      ].filter((r) => r.id !== room.id);
      this.favArrayChanged = !this.favArrayChanged; // Toggle favArrayChanged state
    }
  },
  initializeOffices() {
    const uniqueOffices = new Set(
      this.rooms.map((room) => `office${room.office}`)
    );
    this.officeList = Array.from(uniqueOffices).reduce((acc, office) => {
      acc[office] = [];
      return acc;
    }, {});
  },

  getRooms() {
    console.log(
      "Original data items:",
      this.searchResultsPromiseState.data.items
    );
    this.searchResultsPromiseState.data.items.forEach((item) => {
      console.log("Processing item:", item);
      this.sortIntoOffice(item);
    });
    console.log(
      "Processed office list:",
      JSON.stringify(this.officeList, null, 2)
    );
  },

  //Used to extract usable data from the result
  mapOfficeRooms(item, imageHolder) {
    const itemInfo = {
      id: item.id,
      name: item.name,
      seats: item.seats,
      available: item.available,
      office: item.office,
    };

    //imageHolder[item.id] = "https://i.ibb.co/NyzjMQh/room-placeholder.webp";

    return itemInfo;
  },

  searchRoomsByString(searchParams) {
    //Search after rooms by name, office etc.
  },
  searchRoomsById(idLink) {
    //Search after a specific room by id
  },
};
